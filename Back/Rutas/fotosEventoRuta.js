import express from "express";
import { sequelize } from "../loadSequelize.js";
import { FotosEvento, Usuario, Evento, Participacion } from "../Models/models.js";

//login y seguridad

//Instalar para subir y modificar foto
import multer from "multer";

//conexion entre tablas
// Usuario.hasMany(Participacion, { foreignKey: "id_usuario" });
// Usuario.hasMany(Evento, { foreignKey: "id_usuario" });
// Participacion.belongsTo(Evento, { foreignKey: "id_evento" });

//conexiones no necesarios por ahora
// Evento.hasMany(Participacion, { foreignKey: "id_evento" });

const router = express.Router();

//Lo que indica donde y como se guarda la foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "fotos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

//Para la lista de usuarios que tendra el admin
router.get("/",  function (req, res, next) {
  sequelize
    .sync()
    .then(() => {
      FotosEvento.findAll(
        // include: [
        //   {
        //     model: Evento,
        //     include: { model: Usuario },
        //   },
        //   {
        //     model: Participacion,
        //     include: [
        //       {
        //         model: Evento,
        //       },
        //       { model: Usuario },
        //     ],
        //   },
        // ],
      )
        .then((usuarios) =>
          res.json({
            ok: true,
            data: usuarios,
          })
        )
        .catch((error) =>
          res.json({
            ok: false,
            false: error,
          })
        );
    })
    .catch((error) =>
      res.json({
        ok: false,
        false: error,
      })
    );
});

//Para el perfil del usuario
router.get("/:id", function (req, res, next) {
  sequelize
    .sync()
    .then(() => {
      FotosEvento.findOne({
        where: { id: req.params.id },
        // include: [
        //   {
        //     model: Evento,
        //     include: [{ model: Usuario }, { model: Participacion }],
        //   },
        //   {
        //     model: Participacion,
        //     include: [
        //       {
        //         model: Evento,
        //       },
        //       { model: Usuario },
        //     ],
        //   },
        // ],
      })
        .then((el) =>
          res.json({
            ok: true,
            data: el,
          })
        )
        .catch((error) =>
          res.json({
            ok: false,
            error: error,
          })
        );
    })
    .catch((error) => {
      res.json({
        ok: false,
        error: error,
      });
    });
});

//Para modificar un usuario
router.put("/:id", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    sequelize

      .sync()
      .then(() => {
        const hash = bcrypt.hashSync(req.body.pswd, 10);
        req.body.pswd = hash;
        req.body.foto = req.file ? req.file.path.split("\\")[1] : "noFoto.jpg";

        FotosEvento.findOne({ where: { id: req.params.id } })
          .then((al) => al.update(req.body))
          .then((ret) =>
            res.json({
              ok: true,
              data: ret,
            })
          )
          .catch((error) =>
            res.json({
              ok: false,
              error: error,
            })
          );
      })
      .catch((error) => {
        res.json({
          ok: false,
          error: error,
        });
      });
  });
});

// POST
router.post("/", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json(err);
    }
    sequelize
      .sync()
      .then(() => {
        const hash = bcrypt.hashSync(req.body.pswd, 10);
        req.body.pswd = hash;
        console.log("body", req.body);
        req.body.foto = req.file ? req.file.path.split("\\")[1] : "noFoto.jpg";
        FotosEvento.create(req.body)
          .then((el) => res.json({ ok: true, data: el }))
          .catch((error) => res.json({ ok: false, error }));
        // return res.status(200).send(req.file);
      })
      .catch((error) => {
        res.json({
          ok: false,
          error: error,
        });
      });
  });
});

// put solo de uno
router.put("/:id", function (req, res, next) {
  sequelize
    .sync()
    .then(() => {
      FotosEvento.findOne({ where: { id: req.params.id } })
        .then((usuario) => usuario.update(req.body))
        .then((usuarioMod) =>
          res.json({
            ok: true,
            data: usuarioMod,
          })
        )
        .catch((error) =>
          res.json({
            ok: false,
            error: error.message,
          })
        );
    })
    .catch((error) => {
      res.json({
        ok: false,
        error: error.message,
      });
    });
});

// DELETE
router.delete("/:id", function (req, res, next) {
  sequelize
    .sync()
    .then(() => {
      FotosEvento.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }));
    })
    .catch((error) => {
      res.json({
        ok: false,
        error: error,
      });
    });
});
export default router;