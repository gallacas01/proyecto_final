import '../css/bootstrap.css';
import '../css/styles.css';

export default function Footer() {
    return (
        <div className='container-fluid fs-5' id='footer'>
            <div className='row'>
                <div className='col-auto mx-auto p-2'>
                    <p className='my-auto'>Centro de estudio: I.E.S. Hermanos Machado</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-auto mx-auto p-2'>
                    <p className='my-auto'>Ciclo: Desarrollo de aplicaciones Multiplataforma</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-auto mx-auto p-2'>
                    <p className='my-auto'>Trabajo realizado por Miguel Gallardo Castillo</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-auto ms-auto'>
                <i className="bi bi-envelope-at-fill fs-2 me-2"/> 
                    <a href="mailto:miguigc01@gmail.com" >miguigc01@gmail.com</a>
                </div>
                <div className='col-auto me-auto'>
                    <i className="bi bi-instagram fs-2 me-2"></i>
                    <a href="https://www.instagram.com/miguelgc01_/?hl=es" target='_blank' rel='noreferrer'>miguelgc01_</a>
                </div>
            </div>
        </div>
    );
}