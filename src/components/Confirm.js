import Modal from 'react-bootstrap/Modal';

export default function MyConfirm({showConfirm, setShowConfirm, msg, accion}) {

    const handleAceptar = ( () => {

        //Cuando se haga click en el botón de aceptar, ejecutamos el método que pasa como prop.
        accion();
        setShowConfirm(false);
    });

    return (
   
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
       
       <div className='container p-0'> 
            
            <Modal.Header className='row m-auto' id='modalTitle'>
                <Modal.Title className='col-12 p-0'>ATENCIÓN</Modal.Title> 
            </Modal.Header>            
            
            <Modal.Body className='row m-auto bg-light'>
                <div className='col-12 fs-5 p-0'>
                    {msg}
                </div>  
                <div className='col-4 col-sm-3 col-md-3 me-auto p-1  mt-2'>
                    <button className='btn1 p-0 p-sm-1 w-100' onClick={handleAceptar}> Aceptar</button>
                </div>                 
                <div className='col-4 col-sm-3 col-md-3 ms-auto p-1  mt-2'>
                    <button className='btn1 p-0 p-sm-1 w-100' onClick={() => setShowConfirm(false)}> Cerrar</button>
                </div>              
            </Modal.Body>
        </div>
    </Modal>

    );
}
