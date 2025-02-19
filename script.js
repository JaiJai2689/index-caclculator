const express = require('express');
const app = express();
const port = 3002;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let daftarNilai = [];

function hitungIndeks(nilai) {
    if (nilai <= 59) return "E";
    if (nilai <= 69) return "D";
    if (nilai <= 79) return "C";
    if (nilai <= 89) return "B";
    return "A";
}

app.get('/', (req, res) => {
    const mssg = req.query.err;
    const nama = req.query.nama;
    let errorMessage = mssg && nama ? `${nama} ${mssg}` : "";

    res.render('index.ejs', {
        daftarNilai: daftarNilai,
        errorMessage: errorMessage
    });
});

app.post("/", (req, res) => {
    let matkul = req.body.matkul;
    let nilai = parseInt(req.body.nilai);

    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        const errorMessage = encodeURIComponent("nilai harus dalam rentang 0 - 100!");
        return res.redirect("/?err=" + errorMessage + "&nama=Input");
    }

    let indeks = hitungIndeks(nilai);
    daftarNilai.push({ matkul, nilai, indeks });

    res.redirect("/");
});

app.post("/update", (req, res) => {
    let index = parseInt(req.body.index);
    let matkul = req.body.matkul;
    let nilai = parseInt(req.body.nilai);

    if (isNaN(nilai) || nilai < 0 || nilai > 100 || index < 0 || index >= daftarNilai.length) {
        const errorMessage = encodeURIComponent("Nilai harus dalam rentang 0 - 100!");
        return res.redirect("/?err=" + errorMessage + "&nama=Update");
    }
    daftarNilai[index] = { matkul, nilai, indeks: hitungIndeks(nilai) };

    res.redirect("/");
});

app.post("/delete", (req, res) => {
    let index = parseInt(req.body.index);
    if (index >= 0 && index < daftarNilai.length) {
        daftarNilai.splice(index, 1);
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});