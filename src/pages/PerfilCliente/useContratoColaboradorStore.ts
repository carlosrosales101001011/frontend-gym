import httpClient from "@/common/helpers/httpClient";

export const useContratoColaboradorStore = () => {
    const obtenerContratosxIDColaborador = async(id_empl:number)=>{
        try {
            const { data } = await httpClient.get(`/contrato-empleado/id_empl/${id_empl}`)
            console.log(data);
            
        } catch (error) {
            console.log(error);
        }
    }
    const postContratoxIDColaborador = async(id_empl:number, formState:{id_cargo:number})=>{
        try {
            await httpClient.post(`/contrato-empleado/`, {...formState, id_empl})
        } catch (error) {
            console.log(error);
        }finally{
            obtenerContratosxIDColaborador(id_empl)
        }
    }
  return {
    obtenerContratosxIDColaborador,
    postContratoxIDColaborador
  }
}
