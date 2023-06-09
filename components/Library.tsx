"use client";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";

interface LibraryProps {
  songs: Song[]
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  // console.log(songs)
  const authModal = useAuthModal()
  const { user } = useUser()
  const uploadModal = useUploadModal()

  const onClick = () => {
    if (!user) {
      return authModal.onOpen()
    }
    // TODO: check for subscriptions

    // handle uploads
    return uploadModal.onOpen()
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400">Your Library</p>
        </div>
        <AiOutlinePlusCircle
          onClick={onClick}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((item) => (
          <MediaItem data={item} key={item.id} onClick={() => {}}/>
          // <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </div>
  );
};

export default Library;
