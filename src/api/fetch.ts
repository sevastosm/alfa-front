const groupBy = (keys: any) => (array: any) =>
  array.reduce((objectsByKeyValue: any, obj: any) => {
    const value = keys.map((key: any) => obj[key]).join("-");
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat({
      ...obj,
      generatedKey: value,
    });
    return objectsByKeyValue;
  }, {});

export async function getData(url = "", params: any = {}, short = false) {
  const queryString = encodeURIComponent(JSON.stringify(params));
  const structUrl = url + queryString;
  const response = await fetch(structUrl);
  const data = await response.json(); // parses JSON response into native JavaScript objects
  const groupFincodeStatus = groupBy(["trndate", "fincode", "status"]);
  return short ? groupFincodeStatus(data) : data;
}

// returs client orders
export const fechOrders = async (data) => {
  const result = await getData(
    "https://80.245.167.105:19580/erpapi/getorders/obj?pars=",
    data,
    true
  );
  return result;
};

export const fechGroups = async () => {
  const data = {
    SearchValue: null,
    company: 0,
    BOption: null,
    DFrom: null,
    DTo: null,
    TakeRecs: null,
    Id: null,
    LastId: null,
    AFM: null,
  };

  const result = await getData(
    "https://80.245.167.105:19580/erpapi/getgroups?pars=",
    data
  );
  return await result;
};

//GET /erpapi/getbranches/obj

export const getbranches = async (afm: string) => {
  const data = {
    company: 0,
    afm: afm,
    trdr: 0,
    trdbranch: 0,
    code: "string",
    name: "string",
    address: "string",
    district: "string",
    city: "string",
    phonE1: "string",
  };

  const result = await getData(
    "https://80.245.167.105:19580/erpapi/getbranches/obj?pars=",
    data
  );
  console.log("getbranches", result);
  return result;
};
//put order
const defaults = [
  {
    company: 0,
    bOption: 0,
    trdr: 3975,
    trdbranch: 125,
    comments: "string444dfdfd",
    mtrl: 10069,
    commentS1: "string555666",
    qtY1: 0,
    qtY2: 0,
  },
];

// Example POST method implementation:
export async function postData(url = "", data = defaults) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

// /erpapi/putorder
