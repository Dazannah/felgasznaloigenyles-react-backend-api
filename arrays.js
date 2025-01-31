/*
*********************
* NE TÖRÖLJ SOROKAT *
*********************

status: "inactive" hogy ne lehessen új kérelmet létrehozni az adott jogosultsággal
a régiekben meg fog jelenni, és a folyamatban lévőt is be kell felyezni azzal
*/

const leftColumn = [
  { name: "adName", status: "active", id: "adName", value: "Számítógép bejelentkezési név", for: "adName" },
  { name: "eMail", status: "active", id: "eMail", value: "E-mail cím", for: "eMail" },
  { name: "medworks", status: "active", id: "medworks", value: "Medworks", for: "medworks" },
  { name: "emedworks", status: "active", id: "emedworks", value: "Emedworks", for: "emedworks" },
  { name: "ecostat", status: "active", id: "ecostat", value: "Ecostat", for: "ecostat" },
  { name: "kira", status: "active", id: "kira", value: "KIRA", for: "kira" },
  { name: "beeWise", status: "active", id: "beeWise", value: "Bee Wise", for: "beeWise" },
  { name: "ekeidr", status: "active", id: "ekeidr", value: "EKEIDR", for: "ekeidr" },
  { name: "makElektra", status: "active", id: "makElektra", value: "MÁK Electra", for: "makElektra" },
  { name: "opalIktato", status: "inactive", id: "opalIktato", value: "Opal Iktató rendszer", for: "opalIktato" },
  { name: "jdolber", status: "active", id: "jdolber", value: "Jdolber", for: "jdolber" },
  { name: "quadroByte", status: "active", id: "quadroByte", value: "Quadro Byte Élelmezés", for: "quadroByte" },
  { name: "ovszTraceline", status: "active", id: "ovszTraceline", value: "OVSZ Traceline", for: "ovszTraceline" },
  { name: "coralVercsoport", status: "active", id: "coralVercsoport", value: "Coral vércsoport meghatározás", for: "coralVercsoport" },
  { name: "progesa", status: "active", id: "progesa", value: "Progesa Országos donor nyilvántartó", for: "progesa" },
  { name: "hcPointer", status: "active", id: "hcPointer", value: "HC-Pointer Medivus", for: "hcPointer" },
  { name: "bsoftEkvik", status: "active", id: "bsoftEkvik", value: "BSoft eKVIK kontrolling rendszer", for: "bsoftEkvik" },
  { name: "tetfog", status: "inactive", id: "tetfog", value: "Tetfog fogászati nyilvántartó szoftver", for: "tetfog" },
  { name: "tavleletezes", status: "active", id: "tavleletezes", value: "Távleletezés VPN", for: "tavleletezes" },
  { name: "eeszt", status: "active", id: "eeszt", value: "EESZT", for: "eeszt" },
  { name: "kper", status: "active", id: "kper", value: "KPER", for: "kper" },
  { name: "erad", status: "active", id: "erad", value: "eRAD", for: "erad" },
  { name: "patientPortal", status: "active", id: "patientPortal", value: "Patient Portál", for: "patientPortal" },
  { name: "ipTelefonMellek", status: "active", id: "ipTelefonMellek", value: "IP telefon mellék", for: "ipTelefonMellek" },
  { name: "ipTelefonKilepoKod", status: "active", id: "ipTelefonKilepoKod", value: "IP telefon kilépő kód", for: "ipTelefonKilepoKod" },
]

const middleColumn = [
  { name: "cashFlow", status: "active", id: "cashFlow", value: "Cash flow", for: "cashFlow" },
  { name: "fokonyvRegi", status: "active", id: "fokonyvRegi", value: "Főkönyv régi", for: "fokonyvRegi" },
  { name: "fokonyv", status: "active", id: "fokonyv", value: "Főkönyv", for: "fokonyv" },
  { name: "intezmenyiElbiralas", status: "active", id: "intezmenyiElbiralas", value: "Intézeti elbírálás", for: "intezmenyiElbiralas" },
  { name: "kikuldesiNyilvantartas", status: "active", id: "kikuldesiNyilvantartas", value: "Kiküldetési nyilvántartás", for: "kikuldesiNyilvantartas" },
  { name: "kotelezettsegvallalas", status: "active", id: "kotelezettsegvallalas", value: "Kötelezettségvállalás", for: "kotelezettsegvallalas" },
  { name: "leltar", status: "active", id: "leltar", value: "Leltár", for: "leltar" },
  { name: "leteti", status: "active", id: "leteti", value: "Letéti", for: "leteti" },
  { name: "munkalapIgenyles", status: "active", id: "munkalapIgenyles", value: "Munkalap igénylés", for: "munkalapIgenyles" },
  { name: "munkalap", status: "active", id: "munkalap", value: "Munkalap", for: "munkalap" },
  { name: "osztalyosIgenyles", status: "active", id: "osztalyosIgenyles", value: "Osztályos igénylés", for: "osztalyosIgenyles" },
  { name: "parameterKezelo", status: "active", id: "parameterKezelo", value: "Paraméter kezelő", for: "parameterKezelo" },
  { name: "penzugy", status: "active", id: "penzugy", value: "Pénzügy", for: "penzugy" },
  { name: "penzugy2", status: "active", id: "penzugy2", value: "Pénzügy 2", for: "penzugy2" },
  { name: "projektNyilvantartas", status: "active", id: "projektNyilvantartas", value: "Projekt nyilvántartás", for: "projektNyilvantartas" },
  { name: "projektKezeles", status: "active", id: "projektKezeles", value: "Projekt kezelés", for: "projektKezeles" },
  { name: "raktar", status: "active", id: "raktar", value: "Raktár", for: "raktar" },
  { name: "rendeles", status: "active", id: "rendeles", value: "Rendelés", for: "rendeles" },
  { name: "targyiEszközkezelo", status: "active", id: "targyiEszközkezelo", value: "Tárgyi eszközkezelő", for: "targyiEszközkezelo" },
  { name: "vedelmiRendszer", status: "active", id: "vedelmiRendszer", value: "Védelmi rendszer", for: "vedelmiRendszer" }
]

const rightColumn = [
  { name: "osztalyvezetoFoorvos", status: "active", id: "osztalyvezetoFoorvos", value: "Osztályvezető főorvos", for: "osztalyvezetoFoorvos" },
  { name: "orvos", status: "active", id: "orvos", value: "Orvos", for: "orvos" },
  { name: "osztalyosInformatikus", status: "active", id: "osztalyosInformatikus", value: "Osztályos Informatikus", for: "osztalyosInformatikus" },
  { name: "nover", status: "active", id: "nover", value: "Nővér", for: "nover" },
  { name: "fekvobetegAdminisztrator", status: "active", id: "fekvobetegAdminisztrator", value: "Fekvőbeteg adminisztrátor", for: "fekvobetegAdminisztrator" },
  { name: "jarobetegAdminisztrator", status: "active", id: "jarobetegAdminisztrator", value: "Járóbeteg adminisztrátor", for: "jarobetegAdminisztrator" },
  { name: "kuraszeruEllatas", status: "active", id: "kuraszeruEllatas", value: "Kúraszerű ellátás adminisztrátor", for: "kuraszeruEllatas" },
  { name: "penzugyiRendszer", status: "active", id: "penzugyiRendszer", value: "Gazdálkodási és pénzügyi rendszer", for: "penzugyiRendszer" },
  { name: "osztalyosGyogyszerfelelos", status: "active", id: "osztalyosGyogyszerfelelos", value: "Osztályos gyógyszerfelelős", for: "osztalyosGyogyszerfelelos" },
  { name: "kodoloCsoport", status: "active", id: "kodoloCsoport", value: "Kódoló csoport", for: "kodoloCsoport" },
  { name: "porta", status: "active", id: "porta", value: "Porta", for: "porta" },
  { name: "mutosno", status: "active", id: "mutosno", value: "Műtősnő", for: "mutosno" },
  { name: "osztalyosElemzes", status: "active", id: "osztalyosElemzes", value: "Osztályos élelmezés", for: "osztalyosElemzes" },
  { name: "labworks", status: "active", id: "labworks", value: "Labworks", for: "labworks" },
  { name: "siemensPacs", status: "active", id: "siemensPacs", value: "Siemens PACS", for: "siemensPacs" },
  { name: "elelmezes", status: "active", id: "elelmezes", value: "Élelmezés", for: "elelmezes" }
]

const upperFields = [
  { id: "name", name: "name", value: "Név", subRoute: "name" },
  { id: "isTechnical", value: "Technikai fiók" },
  { id: "dbId", name: "classId", value: "Osztály", subRoute: "className" },
  { id: "classLeader", name: "classLeader", value: "Osztályvezető", subRoute: "classLeader" },
  { id: "post", name: "post", value: "Beosztás", subRoute: "workPost" },
  { id: "location", name: "workLocation", value: "Munkavégzés helye", subRoute: "workLocation" },
  { id: "validFrom", value: "Érvényesség kezdete", subRoute: "validFrom" },
  { id: "validTo", name: "validTo", value: "Érvényesség vége", subRoute: "validTo" }
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
