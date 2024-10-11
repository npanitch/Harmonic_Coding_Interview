import "./App.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CompanyTable from "./components/CompanyTable";
import { createNewCollection, getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";
import MyModal from "./components/MyModal";
import { TextField } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const { data: collectionResponse } = useApi(() => getCollectionsMetadata());

  const [modal, setModal] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');

  useEffect(() => {
    setSelectedCollectionId(collectionResponse?.[0]?.id);
  }, [collectionResponse, modal]);

  const modalChildren = () => {
    return(
      <div>
        <TextField
          id="outlined-collection-input"
          label="NewCollectionName"
          type="new collection"
          value={newCollectionName}
          onChange={(event) => setNewCollectionName(event.target.value)}
        />
        <button className={"bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-300"}
        onClick={createCollection}
        >Add Collection</button>
      </div>
    );
  }

  const createCollection = () => {
    createNewCollection(newCollectionName);
    setNewCollectionName("");
    setModal(false)
  }

  const modalChildren = () => {
    return(
      <div>
        <TextField
          id="outlined-collection-input"
          label="NewCollectionName"
          type="new collection"
          value={newCollectionName}
          onChange={(event) => setNewCollectionName(event.target.value)}
        />
        <button className={"bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-300"}
        onClick={createCollection}
        >Add Collection</button>
      </div>
    );
  }

  const createCollection = () => {
    createNewCollection(newCollectionName);
    setNewCollectionName("");
    setModal(false)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="mx-8">
        <div className="font-bold text-xl border-b p-2 mb-4 text-left">
          Harmonic Jam
        </div>
        <div className="flex">
          <div className="w-1/5">
            <p className=" font-bold border-b pb-2">Collections</p>
            <div className="flex flex-col gap-2">
              {collectionResponse?.map((collection) => {
                return (
                  <div
                    className={`py-1 hover:cursor-pointer hover:bg-orange-300 ${
                      selectedCollectionId === collection.id &&
                      "bg-orange-500 font-bold"
                    }`}
                    onClick={() => {
                      setSelectedCollectionId(collection.id);
                    }}
                  >
                    {collection.collection_name}
                  </div>
                );
              })}
              <div
              className={`py-1 hover:cursor-pointer hover:bg-orange-300`}
              onClick={() => setModal(true)}>
                Add collection +
              </div>
              <MyModal openModal={modal} setOpenModal={setModal} children={modalChildren()}></MyModal>
            </div>
          </div>
          <div className="w-4/5 ml-4">
            {selectedCollectionId && (
              <CompanyTable selectedCollectionId={selectedCollectionId} collectionResponse={collectionResponse} />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
