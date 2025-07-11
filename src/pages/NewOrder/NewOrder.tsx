import { useState, useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { NewOrderContext } from "./NewOrderContext";

import DataTable from "../../components/table/Table";
import BackToMenu from "../../components/BackToMenu";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import OrderOptions from "./components/OrderOptions";
import { Button, TextField, Typography } from "@material-ui/core";
import { postData, downloadPdf } from "../../api/fetch";
import { BranchesContext } from "../../context/BranchesContext";
import Branches from "./components/Branches";
import OrderDialog from "./Dialog";
import { domain } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    table: {
      overflow: "auto",
      marginTop: theme.spacing(4),
    },
    title: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
  })
);

const defaultValues: any = {
  data: {
    search: null,
    fincode: "1",
    sku: "",
    mtrlname: "",
    qtY2: "",
    qtY1: "",
    xdocname: "",
    commentS1: "",
    comments: "",
    qtY1Def: "",
  },
};

export const NewOrder = () => {
  let history = useHistory();
  const { selectedBranch, branch, setSelectBranch } =
    useContext(BranchesContext);

  const [rows, setRows] = useState([]);
  const [orderColor, setOrderColor] = useState("1");

  const [selectedInfo, setSelectedInfo] = useState(defaultValues);
  const getRows = useCallback((rows) => {
    console.log("ROWS-ROWS", rows);
    setRows(rows);
  }, []);

  const [remarkValue, setRemarkValue] = useState("");
  const [isopen, setDialog] = useState(false);
  const [finDoc, setFindoc] = useState(null);
  const [pdfCode, setPdfCode] = useState(null);
  const [colorValue, SetColorValue] = useState(null);
  const [colorCompany, setColorCompany] = useState([]);
  const [selectedColorCompany, setSelectedColorCompany] = useState(null);
  const [selectedTrdpgroup, setSelectedTrdpgroup] = useState(null);

  const handleChangeRemark = (event) => {
    setRemarkValue(event.target.value);
  };

  useEffect(() => {
    if (branch.length > 1) setSelectBranch({});
  }, []);

  const getSelection = useCallback(
    (selectionData) => {
      setSelectedInfo({
        ...selectedInfo,
        data: {
          ...selectedInfo.data,
          search: selectionData.sku,
          fincode: selectionData.u5NAME,
          sku: selectionData.sku,
          mtrlname: selectionData.name,
          mtrl: selectionData.mtrl,
          qtY1: selectionData.mU21,
          qtY2: "1",
          xdocname: selectionData.xdocname,
          qtY1Def: selectionData.mU21,
        },
      });
    },
    [selectedInfo]
  );

  const setComments = useCallback(
    (commentS1) => {
      setSelectedInfo({
        ...selectedInfo,
        data: {
          ...selectedInfo.data,
          commentS1: commentS1,
        },
      });
    },
    [selectedInfo]
  );

  const setWeight = useCallback(
    (selectionData) => {
      const kg = (
        parseFloat(selectionData) * parseFloat(selectedInfo.data.qtY1Def)
      ).toFixed(2);
      // eslint-disable-next-line no-new-wrappers
      const newNum = new Number(kg);
      const num = newNum.toLocaleString("el-GR");
      const convertedNum = newNum.toLocaleString("en-GB");
      setSelectedInfo({
        ...selectedInfo,
        data: {
          ...selectedInfo.data,
          qtY1: num,
          qt1converted: convertedNum,
          qtY2: selectionData,
        },
      });
    },
    [selectedInfo]
  );

  const resetSelection = useCallback(() => {
    setSelectedInfo(defaultValues);
  }, []);

  const actions = {
    getSelection,
    resetSelection,
  };

  const classes = useStyles();

  // Sets value of the radio buttons

  //Orders created

  const handleSetSelectedValue = (val) => {
    setSelectedInfo({
      ...selectedInfo,
      data: { ...selectedInfo.data, search: val },
    });
  };

  const setColorValue = useCallback((val) => {
    SetColorValue(val);
  }, []);

  const setFinCode = (val) => {
    setSelectedInfo({
      ...selectedInfo,
      data: { ...selectedInfo.data, fincode: val },
    });
  };
  const headCellsDetails: any = [
    { id: "fincode", numeric: false, label: "ΟΜΑΔΑ" },
    { id: "sku", numeric: false, label: "ΚΩΔΙΚΟΣ" },
    { id: "mtrlname", numeric: false, label: "ΠΕΡΙΓΡΑΦΗ" },
    { id: "qtY2", numeric: true, label: "ΒΕΡΓΕΣ" },
    { id: "qtY1", numeric: true, label: "ΚΙΛΑ" },
    { id: "xdocname", numeric: false, label: "ΤΟΜΗ" },
    { id: "commentS1", numeric: false, label: "ΠΑΡΑΤΗΡΗΣΕΙΣ" },
    { id: "action", numeric: false, label: "" },
  ];

  const handleDownload = () => {
    downloadPdf(pdfCode, finDoc);
  };

  // post order

  const handlePostData = () => {
    //   // eslint-disable-next-line no-new-wrappers
    //   const number = new Number(num).toLocaleString("en-US");
    //   return number;
    // };

    const orderData: any = rows.map((orderItem) => {
      return {
        company: 10,
        boption: orderColor,
        trdr: selectedBranch.trdr,
        trdbranch:
          selectedBranch.trdbranch === 0 ? null : selectedBranch.trdbranch,
        comments:
          colorValue && typeof colorValue === "object"
            ? colorValue.sku
            : colorValue,
        mtrl: orderItem.mtrl,
        commentS1: orderItem.commentS1,
        qtY1: orderItem.qt1converted,
        qtY2: orderItem.qtY2,
        remarks: remarkValue,
        CCCBAFIOID: selectedColorCompany,
        ccCPOUDRAID: colorValue && colorValue.ccCPOUDRAID,
      };
    });

    postData(`${domain}/erpapi/putorder`, orderData).then((data: any) => {
      if (data.response.statusText === "OK") {
        setDialog(true);
        setFindoc(data.data.findoc);
        setPdfCode(data.data.fincode);
      }
      console.log(data); // JSON data parsed by `data.json()` call
    });
  };
  const stateData = {
    selectedInfo,
    actions,
    orderColor,
    colorValue,
    handleSetSelectedValue,
    setWeight,
    setComments,
    setOrderColor,
    setColorValue,
    setFinCode,
    setSelectedColorCompany,
    selectedColorCompany,
    selectedTrdpgroup,
    setSelectedTrdpgroup,
    colorCompany,
    setColorCompany,
  };

  console.log("stateData", stateData);

  return (
    <NewOrderContext.Provider value={stateData}>
      <Grid container spacing={3} justifyContent="center">
        <BackToMenu />
        <Grid item xs={12}>
          <Typography className={classes.title}>ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <OrderOptions isDisabled={rows.length > 0} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} sm={12} className={classes.table}>
          <DataTable
            name="details"
            onRowclick={() => false}
            headCells={headCellsDetails}
            clearCell
            rows={[]}
            add
            getRows={getRows}
            pagination={false}
            rowsPerPagenum={100}
          />
        </Grid>
        <Grid container justifyContent="center">
          <Grid item>
            <TextField
              variant="outlined"
              id="outlined-multiline-flexible"
              label="ΠΑΡΑΤΗΡΗΣΕΙΣ"
              multiline
              maxRows={4}
              value={remarkValue}
              onChange={handleChangeRemark}
              style={{ width: 350 }}
            />
          </Grid>
        </Grid>
        <Grid item justifyContent="center">
          <Grid container spacing={3} justifyContent="center">
            {rows.length > 0 && (
              <>
                <Grid item xs={12} justifyContent="center">
                  <div style={{ textAlign: "center" }}>
                    {branch.length > 1 && <Branches />}
                  </div>
                </Grid>
                <Grid item xs={12} justifyContent="center">
                  {console.log("selectedBranch", branch)}
                  {selectedBranch && (
                    <div style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePostData}
                      >
                        ΑΠΟΣΤΟΛΗ ΠΑΡΑΓΓΕΛΙΑΣ
                      </Button>
                    </div>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <OrderDialog
        open={isopen}
        finDoc={pdfCode}
        onClose={() => setDialog(!isopen)}
        getPdf={handleDownload}
      />
    </NewOrderContext.Provider>
  );
};
