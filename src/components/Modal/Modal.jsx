import "./Modal.css";

function LogOutModal({ activeModal, handleCloseModal }) {
  return (
    <div
      className={`modal ${activeModal === "logout" ? "modal__opened" : ""} `}
    >
      <div className="modal__content">
        <h2 className="modal__logout-title">
          Are You Sure You Want to Log Out?
        </h2>
        <button className="modal__logout-btn">Log Out</button>
      </div>
    </div>
  );
}

export default LogOutModal;
