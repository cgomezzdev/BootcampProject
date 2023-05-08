import React, { useState, useEffect, useContext } from "react";
import { Form, Col, Row, Button, Container, FormGroup } from "react-bootstrap";
import MapView from "../mapa/MapView";
import "leaflet/dist/leaflet.css";
import "../mapa/leaflet.css";
import GlobalContext from "../GlobalContext";

function NuevoEvento(props) {
  const { userid, token } = useContext(GlobalContext);
  const [direccion, setDireccion] = useState("");
  const [evento, setEvento] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    direccion: "",
    latitud: 0,
    longitud: 0,
    nivel: "",
    participantes: "",
  });

  useEffect(() => {
    setEvento({
      ...evento,
      direccion: direccion.display_name,
      longitud: direccion.lon * 1,
      latitud: direccion.lat * 1,
    });
  }, [direccion]);

  function CrearEvento(e) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora: evento.hora,
      latitud: evento.latitud,
      longitud: evento.longitud,
      direccion: evento.direccion,
      nivel: evento.nivel,
      participantes: evento.participantes,
      id_usuario: userid,
      // foto: evento.foto,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/eventos", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(() => {
        setEvento({
          titulo: "",
          descripcion: "",
          fecha: "",
          hora: "",
          direccion: "",
          latitud: 0,
          longitud: 0,
          nivel: "",
          participantes: "",
        });
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <Container fluid="lg">
      {/* className="image" demomento */}
      <Row>
        <h3>Crear un nuevo evento</h3>
        {/*deberiamos pensar un titulo o dejar este que indica que esta pantalla  */}
      </Row>
      <Row>
        <Col>
          <Form>
            <Row md={2}>
              <Form.Group className="mb-3" controlId="formBasicEmail" as={Col}>
                <Form.Label>Titulo</Form.Label>
                <Form.Control
                  value={evento.titulo}
                  onInput={(e) =>
                    setEvento({ ...evento, titulo: e.target.value })
                  }
                  type="text"
                  placeholder="Inserta un titulo"
                />
                <Form.Label>Participantes</Form.Label>
                <Form.Select
                  value={evento.participantes}
                  onInput={(e) =>
                    setEvento({ ...evento, participantes: e.target.value })
                  }
                  type="number"
                  aria-label="Default select example"
                >
                  <option>Selecciona el número de participantes</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </Form.Select>
                <Form.Label>Nivel</Form.Label>
                <Form.Select
                  value={evento.nivel}
                  onInput={(e) =>
                    setEvento({ ...evento, nivel: e.target.value })
                  }
                  type="text"
                  aria-label="Default select example"
                >
                  <option>Selecciona el Nivel</option>
                  <option>Principante</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </Form.Select>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    value={evento.fecha}
                    onInput={(e) =>
                      setEvento({ ...evento, fecha: e.target.value })
                    }
                    type="date"
                    placeholder="Contraseña"
                  />
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      value={evento.hora}
                      onInput={(e) =>
                        setEvento({ ...evento, hora: e.target.value })
                      }
                      type="time"
                      rows={3}
                    />
                  </Form.Group>
                </Form.Group>
              </Form.Group>
              <Row size={2}>
                <MapView direccion={direccion} setDireccion={setDireccion} />
              </Row>
            </Row>
            <br></br>
            <Row md={2}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  value={evento.descripcion}
                  onInput={(e) =>
                    setEvento({ ...evento, descripcion: e.target.value })
                  }
                  type="text"
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={evento.direccion}
                  onInput={(e) =>
                    setEvento({ ...evento, direccion: e.target.value })
                  }
                  type="text"
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="button" onClick={CrearEvento}>
                Crear
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default NuevoEvento;
