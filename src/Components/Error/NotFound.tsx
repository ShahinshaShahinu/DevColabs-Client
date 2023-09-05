

function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <img src="../../../public/Images/5203299.jpg" alt="Error" className="max-w-md h-auto" />
                <p className="text-2xl mt-4">Oops! Something went wrong.</p>
                <button
                    onClick={() => window?.history?.back()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-lg"
                >
                    Back to DevColab
                </button>
            </div>

        </>
    )
}

export default NotFound