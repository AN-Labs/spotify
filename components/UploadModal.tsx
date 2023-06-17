import { useState } from "react"
import Modal from "./Modal"
import useUploadModal from "@/hooks/useUploadModal"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import Input from "./Input"
import Button from "./Button"
import uniqid from 'uniqid'
import { toast } from "react-hot-toast"

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const uploadModal = useUploadModal()
    const supabaseClient = useSupabaseClient()
    const { user } = useUser()
    const router = useRouter()

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset()
            uploadModal.onClose()
        }
    }
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if (!imageFile || !songFile || !user) {
                toast.error('Missing fields')
                return
            }

            const uniqueID = uniqid()

            // upload to song
            const { data: songData, error: songError } =
                await supabaseClient
                    .storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
                        cacheControl: '3600',
                        upsert: false
                    })

            if (songError) {
                setIsLoading(false)
                return toast.error('Failed to upload song')
            }

            // upload cover art/image
            const { data: imageData, error: imageError} = 
            await supabaseClient
            .storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

            if (imageError) {
                setIsLoading(false)
                return toast.error('Failed to upload image')
            }

            // create record
            const {error: supabaseError} = await supabaseClient
            .from('songs').insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            })

            if (supabaseError) {
                return toast.error(supabaseError.message)
            }

            router.refresh()
            setIsLoading(false)
            toast.success('Song created')
            reset()
            uploadModal.onClose()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            title="Add a song"
            description="Upload .mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <div className="pb-1">
                        Upload a song file
                    </div>
                    <Input
                        id="song"
                        disabled={isLoading}
                        {...register('song', { required: true })}
                        type="file"
                        accept=".mp3"
                        placeholder="test"
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Upload a cover art
                    </div>
                    <Input
                        id="image"
                        disabled={isLoading}
                        {...register('image', { required: true })}
                        type="file"
                        accept="image/*"
                        placeholder="test"
                    />
                </div>
                <Button disabled={isLoading} type="submit">Upload</Button>
            </form>
        </Modal>
    )
}

export default UploadModal