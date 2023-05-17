import { useState } from 'react';
import '../css/bootstrap.css';
import '../css/styles.css';
import Modal from 'react-bootstrap/Modal';

 function MyModaaaaaaal({showModal, setShowModal,tipo, texto}) {

  return (
   
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
       
       <div className='container-fluid p-0 w-100'> 
            
            <Modal.Header className='d-flex align-items-center justify-content-center row m-auto' id='modalTitle'>
                <Modal.Title className='col-12'>{tipo}</Modal.Title> 
            </Modal.Header>            
            
            <Modal.Body className='d-flex align-items-center justify-content-center row m-auto bg-light'>
                <div className='col-12 fs-5'>
                    {texto}
                </div>               
                <div className='col-10'></div>                
                <button className='btn1 col-2 mt-3 p-1' onClick={() => setShowModal(false)}>
                    Cerrar
                </button>
            </Modal.Body>
        </div>
    </Modal>

    );
}

export default function MyModal(){

    const [showModal, setShowModal] = useState(false);
    return(

        <>
            <button onClick={() => setShowModal(true)}>MOSTRAR</button>
            <MyModaaaaaaal showModal={showModal} setShowModal={setShowModal} tipo={"INFORMACIÓN"} texto={"HOOLAAAAAA"} />
        </>
        
    )

}