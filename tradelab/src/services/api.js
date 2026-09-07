const API_URL = "http://localhost:5000";

export async function testBackend(){
    try{
        const response= await fetch
        (`${API_URL}/api/test`);

        if(!response.ok){
            throw new Error("Backend request failed");
        }

        return response.json();

    } catch (error) {
        console.error("Error testing backend:", error);
        throw error;
    }
}