import { Text } from "react-native"


const ErrorText = ({ msg }: { msg: string | null }) => {
    return (
        <Text style={{ color: "red", marginTop: 10, fontSize: 12, fontFamily: 'PoppinsMedium' }}>{msg}</Text>
    )
}

export default ErrorText