'use client'

import Box from "@/components/Box"
import { PulseLoader } from "react-spinners"

const loading = () => {
    return (
        <Box className="h-full flex items-center justify-center">
            <PulseLoader color="#22c55e" size={40} />
        </Box>
    )
}

export default loading