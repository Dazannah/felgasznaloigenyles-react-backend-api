const leftColumn = [
  { name: "adName", id: "adName", value: "Számítógép bejelentkezési név", for: "adName" },
  { name: "eMail", id: "eMail", value: "E-mail cím", for: "eMail" },
  { name: "medworks", id: "medworks", value: "Medworks", for: "medworks" },
  { name: "emedworks", id: "emedworks", value: "Emedworks", for: "emedworks" },
  { name: "ecostat", id: "ecostat", value: "Ecostat", for: "ecostat" },
  { name: "kira", id: "kira", value: "KIRA", for: "kira" },
  { name: "makElektra", id: "makElektra", value: "MÁK Electra", for: "makElektra" },
  { name: "opalIktato", id: "opalIktato", value: "Opal Iktató rendszer", for: "opalIktato" },
  { name: "jdolber", id: "jdolber", value: "Jdolber", for: "jdolber" },
  { name: "quadroByte", id: "quadroByte", value: "Quadro Byte Élelmezés", for: "quadroByte" },
  { name: "ovszTraceline", id: "ovszTraceline", value: "OVSZ Traceline", for: "ovszTraceline" },
  { name: "coralVercsoport", id: "coralVercsoport", value: "Coral vércsoport meghatározás", for: "coralVercsoport" },
  { name: "progesa", id: "progesa", value: "Progesa Országos donor nyilvántartó", for: "progesa" },
  { name: "hcPointer", id: "hcPointer", value: "HC-Pointer Medivus", for: "hcPointer" },
  { name: "bsoftEkvik", id: "bsoftEkvik", value: "BSoft eKVIK kontrolling rendszer", for: "bsoftEkvik" },
  { name: "tetfog", id: "tetfog", value: "Tetfog fogászati nyilvántartó szoftver", for: "tetfog" },
  { name: "tavleletezes", id: "tavleletezes", value: "Távleletezés VPN", for: "tavleletezes" },
  { name: "ipTelefonMellek", id: "ipTelefonMellek", value: "IP telefon mellék", for: "ipTelefonMellek" },
  { name: "ipTelefonKilepoKod", id: "ipTelefonKilepoKod", value: "IP telefon kilépő kód", for: "ipTelefonKilepoKod" }
]

const middleColumn = [
  { name: "cashFlow", id: "cashFlow", value: "Cash flow", for: "cashFlow" },
  { name: "fokonyvRegi", id: "fokonyvRegi", value: "Főkönyv régi", for: "fokonyvRegi" },
  { name: "fokonyv", id: "fokonyv", value: "Főkönyv", for: "fokonyv" },
  { name: "intezmenyiElbiralas", id: "intezmenyiElbiralas", value: "Intézeti elbírálás", for: "intezmenyiElbiralas" },
  { name: "kikuldesiNyilvantartas", id: "kikuldesiNyilvantartas", value: "Kiküldetési nyilvántartás", for: "kikuldesiNyilvantartas" },
  { name: "kotelezettsegvallalas", id: "kotelezettsegvallalas", value: "Kötelezettségvállalás", for: "kotelezettsegvallalas" },
  { name: "leltar", id: "leltar", value: "Leltár", for: "leltar" },
  { name: "leteti", id: "leteti", value: "Letéti", for: "leteti" },
  { name: "munkalapIgenyles", id: "munkalapIgenyles", value: "Munkalap igénylés", for: "munkalapIgenyles" },
  { name: "munkalap", id: "munkalap", value: "Munkalap", for: "munkalap" },
  { name: "osztalyosIgenyles", id: "osztalyosIgenyles", value: "Osztályos igénylés", for: "osztalyosIgenyles" },
  { name: "parameterKezelo", id: "parameterKezelo", value: "Paraméter kezelő", for: "parameterKezelo" },
  { name: "penzugy", id: "penzugy", value: "Pénzügy", for: "penzugy" },
  { name: "penzugy2", id: "penzugy2", value: "Pénzügy 2", for: "penzugy2" },
  { name: "projektNyilvantartas", id: "projektNyilvantartas", value: "Projekt nyilvántartás", for: "projektNyilvantartas" },
  { name: "projektKezeles", id: "projektKezeles", value: "Projekt kezelés", for: "projektKezeles" },
  { name: "raktar", id: "raktar", value: "Raktár", for: "raktar" },
  { name: "rendeles", id: "rendeles", value: "Rendelés", for: "rendeles" },
  { name: "targyiEszközkezelo", id: "targyiEszközkezelo", value: "Tárgyi eszközkezelő", for: "targyiEszközkezelo" },
  { name: "vedelmiRendszer", id: "vedelmiRendszer", value: "Védelmi rendszer", for: "vedelmiRendszer" }
]

const rightColumn = [
  { name: "osztalyvezetoFoorvos", id: "osztalyvezetoFoorvos", value: "Osztályvezető főorvos", for: "osztalyvezetoFoorvos" },
  { name: "orvos", id: "orvos", value: "Orvos", for: "orvos" },
  { name: "osztalyosInformatikus", id: "osztalyosInformatikus", value: "Osztályos Informatikus", for: "osztalyosInformatikus" },
  { name: "nover", id: "nover", value: "Nővér", for: "nover" },
  { name: "fekvobetegAdminisztrator", id: "fekvobetegAdminisztrator", value: "Fekvőbeteg adminisztrátor", for: "fekvobetegAdminisztrator" },
  { name: "jarobetegAdminisztrator", id: "jarobetegAdminisztrator", value: "Járóbeteg adminisztrátor", for: "jarobetegAdminisztrator" },
  { name: "kuraszeruEllatas", id: "kuraszeruEllatas", value: "Kúraszerű ellátás adminisztrátor", for: "kuraszeruEllatas" },
  { name: "penzugyiRendszer", id: "penzugyiRendszer", value: "Gazdálkodási és pénzügyi rendszer", for: "penzugyiRendszer" },
  { name: "osztalyosGyogyszerfelelos", id: "osztalyosGyogyszerfelelos", value: "Osztályos gyógyszerfelelős", for: "osztalyosGyogyszerfelelos" },
  { name: "kodoloCsoport", id: "kodoloCsoport", value: "Kódoló csoport", for: "kodoloCsoport" },
  { name: "porta", id: "porta", value: "Porta", for: "porta" },
  { name: "mutosno", id: "mutosno", value: "Műtősnő", for: "mutosno" },
  { name: "osztalyosElemzes", id: "osztalyosElemzes", value: "Osztályos élelmezés", for: "osztalyosElemzes" },
  { name: "labworks", id: "labworks", value: "Labworks", for: "labworks" },
  { name: "siemensPacs", id: "siemensPacs", value: "Siemens PACS", for: "siemensPacs" },
  { name: "elelmezes", id: "elelmezes", value: "Élelmezés", for: "elelmezes" }
]

const upperFields = [
  { id: "name", name: "name", value: "Név" },
  { id: "dbId", name: "classId", value: "Osztály" },
  { id: "classLeader", name: "classLeader", value: "Osztályvezető" },
  { id: "post", name: "post", value: "Beosztás" },
  { id: "location", name: "workLocation", value: "Munkavégzés helye" },
  { id: "validTo", name: "validTo", value: "Érvényesség vége" }
]

function getArrays(req, res) {
  res.json({
    leftColumn,
    middleColumn,
    rightColumn,
    upperFields
  })
}

module.exports = {
  getArrays,
  leftColumn,
  middleColumn,
  rightColumn,
  upperFields
}
