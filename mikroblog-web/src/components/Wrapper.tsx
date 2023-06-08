import { Box } from "@chakra-ui/react"

type WrapperProps = {
    variant?: 'small' | 'regular'
    children: React.ReactNode
}



export const Wrapper: React.FC<WrapperProps> = ({
    children,
    variant = "regular"
}) => {
    return (
        <Box
            mt={7}
            mx="auto"
            maxW={variant === "regular" ? "800px" : "400px" }
            maxWidth="250px"
            w="100%">
            {children}
        </Box>
    )
}