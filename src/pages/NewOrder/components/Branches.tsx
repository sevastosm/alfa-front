import { FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";
import React, { ReactElement, useContext, useEffect } from "react";
import { BranchesContext } from "../../../context/BranchesContext";

interface Props {}

export default function Branches({}: Props): ReactElement {
  const { branch, selectedBranch, setSelectBranch } =
    useContext(BranchesContext);

  const handleSelectBranch = (e: any) => {
    let val = e.target.value;
    const selected = branch.filter((data) => data.code === val);
    setSelectBranch(selected);
  };

  // useEffect(() => {
  //   return branch.length === 1 && setSelectBranch(branch[0]);
  // }, [branch, setSelectBranch]);

  return (
    <FormControl fullWidth>
      <InputLabel className="branch" id="demo-simple-select-label">
        ΚΑΤΑΣΤΗΜΑ
      </InputLabel>
      {branch.length > 0 && (
        <Select
          onChange={handleSelectBranch}
          name="fincode"
          value={selectedBranch.address}
        >
          {branch.map((v: any, i) => (
            <MenuItem value={v.code}>{v.address}</MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
}
