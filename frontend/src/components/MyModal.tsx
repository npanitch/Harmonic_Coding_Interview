import { Backdrop, Box, Fade, Modal} from "@mui/material";
import { useEffect } from "react";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  type Props = {
    openModal: boolean
    setOpenModal: Function 
    children: JSX.Element
  }





const MyModal = (props: Props) => {
    useEffect(() => {
    }, [props.children]
  );
    return (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.openModal}
        onClose={() => props.setOpenModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.openModal}>
          <Box sx={style}>
            {props.children}
          </Box>
        </Fade>
      </Modal>
    );
}


export default MyModal;