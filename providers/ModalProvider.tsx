'use client'

import AuthModal from "@/components/AuthModal"
import Modal from "@/components/Modal"
import UploadModal from "@/components/UploadModal"
import { useEffect, useState } from "react"

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    // to prevent errors in hydration caused by modals
    // modals cannot be seen during server side rendering
    useEffect(() => { setIsMounted(true) }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <AuthModal />
            <UploadModal />
        </>
    )
}

export default ModalProvider