import "./Modal.css";

function logOutModal({ activeModal }) {
  return (
    <div className={`modal ${activeModal === "logout"} : modal__opened : ""`}>
      <button className="logOutModal-btn">Log Out</button>
    </div>
  );
}

export default logOutModal;
