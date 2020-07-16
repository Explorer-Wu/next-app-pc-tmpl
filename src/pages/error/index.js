import { useRouter } from "next/router"
function NoMatch() {
    const router = useRouter()
    return <div>
        <h3>
            No match for <code>{router.pathname}</code>
        </h3>
    </div>
} 

export default NoMatch