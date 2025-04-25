import { toast } from 'react-toastify';

export const errorMsg = (error, dura) => {
    toast.error(error, {
        position: "top-center",
        autoClose: dura,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
};
export const warningMsg = (error, dura) => {
    toast.warning(error, {
        position: "top-center",
        autoClose: dura,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
};
export const successMsg = (error, dura) => {
    toast.success(error, {
        position: "top-center",
        autoClose: dura,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
};


