import '../css/bootstrap.css';
import '../css/styles.css';
import Modal from 'react-bootstrap/Modal';

export default function MyModal({showModal, setShowModal, tipo, texto}) {

  return (
   
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
       
       <div className='container p-0'> 
            
            <Modal.Header className='row m-auto' id='modalTitle'>
                <Modal.Title className='col-12 p-0'>{tipo === true ? "ERROR" : "INFORMACIÓN" }</Modal.Title> 
            </Modal.Header>            
            
            <Modal.Body className='row m-auto bg-light'>
                <div className='col-12 fs-5 p-0'>
                    {texto}
                </div>               
                <div className='col-4 col-sm-3 col-md-3 ms-auto p-1  mt-2'>
                    <button className='btn1 p-0 p-sm-1 w-100' onClick={() => setShowModal(false)}> Cerrar</button>
                </div>              
            </Modal.Body>
        </div>
    </Modal>

    );
}
