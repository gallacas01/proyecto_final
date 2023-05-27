export default function CardEquipo({info}){

    return(

        <div className='col-lg-3 p-1 my-1'>
            <div className="card my-0 border-2 rounded-3">
                <div className="card-body fs-5 p-0">

                   <div className="row mx-auto">
                        <div className="col-12 p-0">
                            <img src={info.escudo} className="img-fluid m-auto" alt="Imagen del equipo"/>
                        </div>
                    </div>
                    <div className="row mx-auto p-1">
                        <div className="col-12">
                            <p className="m-auto">Nombre: {info.nombre}</p>
                        </div>
                    </div>
                    <div className="row mx-auto p-1">
                        <div className="col-12">
                            <p className="m-auto">Estadio: {info.estadio}</p>
                        </div>
                    </div>
                    <div className="row mx-auto p-1">
                        <div className="col-12">
                            <p className="m-auto">Fundación: {info.fecha_fundacion}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}