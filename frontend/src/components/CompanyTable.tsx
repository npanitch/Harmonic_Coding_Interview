import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getCollectionCompaniesById, getCollectionsById, ICollection, ICompany, setCompanyToList } from "../utils/jam-api";
import MyModal from "./MyModal";
import { TrophySpin } from "react-loading-indicators";


const CompanyTable = (props: { selectedCollectionId: string, collectionResponse: ICollection[] | undefined}) => {
  const [response, setResponse] = useState<ICompany[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectionModal, setSelectionModal] = useState<GridRowSelectionModel>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
      (newResponse) => {
        setResponse(newResponse.companies);
        setTotal(newResponse.total);
      }
    );
  }, [props.selectedCollectionId, offset, pageSize, loading==false]);


  useEffect(() => {
    setOffset(0);
  }, [props.selectedCollectionId]);

  async function setList(id: string){
    setLoading(true)
    if (typeof selectionModal !== "undefined" && selectionModal.length > 0){
      await setCompanyToList(numArray(selectionModal.map((row) => row.valueOf())), id)
    }
    else{
      let ids = await getCollectionCompaniesById(props.selectedCollectionId)
      await setCompanyToList(ids, id)
    }
    setLoading(false)
    setSelectionModal([])
    setOpenModal(false)
  }

  const collectionList = () => {
    if(loading){
      return(
        <div className="flex items-center justify-center h-full">
          <h1>Adding... </h1>
          <TrophySpin color="#d5894c" size="medium" text="" textColor="" />
        </div>
      )
    }
    else{
      return(
        
        <div>
          {props.collectionResponse?.map((collection) => {
                return (
                  <div
                    className={`py-1 hover:cursor-pointer hover:bg-orange-300`}
                    onClick={() => {
                      setList(collection.id);
                    }}
                  >
                    {collection.collection_name}
                  </div>
                );
              })}
        </div>
      )
    }
  }



  const submitSelectedButton = () => {
    return(
      <div>
        <button 
          className={loading ? "bg-grey-800 text-white font-bold py-2 px-4 rounded hover:bg-grey-600 mr-1" : "bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-300 mr-1"}
          onClick={() => setOpenModal(true)}
          disabled={loading}>
          {loading ? ('Adding to Collection') : ('Add Selected to Collection')}
        </button>
        <MyModal openModal={openModal} setOpenModal={setOpenModal} children={collectionList()}/>
      </div>
    );
  }

    // Add function that will
    const submitAllButton = () => {
      return(
        <div>
          <button 
            className={loading ? "bg-grey-800 text-white font-bold py-2 px-4 rounded hover:bg-grey-600" : "bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-300"}
  
            onClick={() => {
              setSelectionModal([])
              setOpenModal(true)
            }
            }
            disabled={loading}>
            {loading ? ('Adding to Collection') : ('Add All to Collection')}
          </button>
          <MyModal openModal={openModal} setOpenModal={setOpenModal} children={collectionList()}/>
        </div>
      );
    }

  function numArray(array:  (string | number)[]): number[] {
    const resArray = array.filter((el): el is number => typeof(el) === 'number');
  
    return resArray;
  }


  return (
    <div style={{ height: 750, width: "100%" }}>
      <DataGrid
        rows={response}
        rowHeight={30}
        columns={[
          { field: "liked", headerName: "Liked", width: 90 },
          { field: "id", headerName: "ID", width: 90 },
          { field: "company_name", headerName: "Company Name", width: 200 },
        ]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        rowCount={total}
        pagination
        checkboxSelection
        paginationMode="server"
        onRowSelectionModelChange={(ids) => {
          setSelectionModal(ids);
        }
        }
        rowSelectionModel={selectionModal}
        onPaginationModelChange={(newMeta) => {
          setPageSize(newMeta.pageSize);
          setOffset(newMeta.page * newMeta.pageSize);
        }
        }
      />
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px' }}>
      {selectionModal.length !== 0 && submitSelectedButton()}
      {submitAllButton()}
      </div>
    </div>
    //Add submit button, on click sets IDs "liked" bool to true - has spinner while statuses are updating
  );
};

export default CompanyTable;
