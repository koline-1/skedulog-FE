import { useState, useEffect } from "react";

const useDocumentTitle: Function = () => {
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (title) {
            document.title = title+' | Skedulog';
        } else {
            document.title = '재미있고 효율적인 스케줄 관리! | Skedulog'
        }
    }, [title])

    return { setTitle };
}

export default useDocumentTitle;