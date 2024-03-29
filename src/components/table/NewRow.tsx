import { useEffect, useState, useCallback, useContext } from "react";
import {
  TableRow,
  Input,
  TableCell,
  IconButton,
  FormControl,
  MenuItem,
  TextField,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import Select from "@material-ui/core/Select";
import { SaveRounded } from "@material-ui/icons";

import Autocomplete from "../AutoComplete";

import { fechGroups } from "../../api/fetch";
import { NewOrderContext } from "../../pages/NewOrder/NewOrderContext";

interface Props {
  saveOrder: (values: any) => void;
}

export const NewRow = ({ saveOrder }: Props) => {
  const { selectedInfo, setWeight, actions, setComments, setFinCode } =
    useContext(NewOrderContext);

  const { mtrlname, qtY1, qtY2, xdocname, commentS1, search } =
    selectedInfo.data;

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(selectedInfo.data.fincode);

  const handleChange = (e: any) => {
    let val = e.target.value;
    setWeight(val);
  };

  const handleChangeComments = (e: any) => {
    let val = e.target.value;
    setComments(val);
  };

  const handleSelectFincode = (e: any) => {
    let val = e.target.value;
    actions.resetSelection();
    setGroup(val);
    setFinCode(val);
  };

  const getGroups = useCallback(async () => {
    const groups: any = await fechGroups();
    setGroups(groups);

    //sets default value
    setGroup(groups[0].name);
    setFinCode(groups[0].name);
  }, []);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const handleSave = () => {
    console.log("selectedInfo", selectedInfo.data);
    if (selectedInfo.data.qtY2 < 1) {
      return alert(
        "Δεν έχει συμπληρωθεί το πεδίο – βέργες έλαχιστη ποσότητα 1"
      );
    }
    saveOrder(selectedInfo.data);
    actions.resetSelection();
  };

  const Qty1 = qtY1.toLocaleString("el-GR");

  useEffect(() => {
    if (qtY2 === "1") {
      setWeight(qtY2);
    }
  }, [qtY2]);

  return (
    <TableRow>
      <TableCell>
        <FormControl>
          {groups.length > 0 && (
            <Select onChange={handleSelectFincode} name="fincode" value={group}>
              {groups.map((v: any, i) => (
                <MenuItem value={v.name}>{v.name}</MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </TableCell>
      <TableCell>
        <Autocomplete />
      </TableCell>
      <TableCell>
        <Input value={mtrlname} disabled title={mtrlname} />
      </TableCell>
      <TableCell>
        <TextField
          id="number"
          name="qtY2"
          value={qtY2}
          onChange={handleChange}
          type="number"
        />
      </TableCell>
      <TableCell>
        <Input name="qtY1" value={Qty1} disabled />
      </TableCell>
      <TableCell>
        {xdocname ? (
          <img
            alt="xdocname"
            src={`https://alfa-press.gr/wp-content/themes/porto-child/erp/icons/${xdocname}`}
            height="90"
          />
        ) : (
          <ImageIcon />
        )}
      </TableCell>
      <TableCell>
        <Input
          name="commentS1"
          value={commentS1}
          onChange={handleChangeComments}
        />
      </TableCell>
      {search && (
        <TableCell>
          <IconButton onClick={handleSave} color="primary" component="span">
            <SaveRounded />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};
