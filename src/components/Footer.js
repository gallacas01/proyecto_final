import '../css/bootstrap.css';
import '../css/styles.css';

export default function MyFooter() {
    return (
        <div className='container-fluid fs-5' id='footer'>
            <div className='row mx-1'>
                <div className='col-12 mt-2'>
                    <p className='text-center'>Centro de estudio: I.E.S. Hermanos Machado</p>
                </div>
                <div className='col-12'>
                    <p className='text-center'>Ciclo: Desarrollo de Aplicaciones Multiplataforma</p>
                </div>                      
                <div className='col-12'>
                    <p className='text-center'>Trabajo realizado por <span style={{color: "rgb(252, 224, 179)"}}>Miguel Gallardo Castillo</span> </p>
                </div>
            </div>  
            <div className='row'>
                <div className='col-12'>
                    <p className='text-center'>
                        <i className="bi bi-envelope-at-fill fs-2 ms-1 me-1 p-0"/> 
                        <a href="mailto:miguigc01@gmail.com">miguigc01@gmail.com</a>
                
                        <i className="bi bi-instagram fs-2 ms-2 me-1"></i>
                        <a href="https://www.instagram.com/miguelgc01_/?hl=es" target='_blank' rel='noreferrer'>miguelgc01_</a>
                    </p>
                </div>
            </div>
        </div>
    );
}