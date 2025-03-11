import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import HistoricUserModal from "../../components/HistoricUserModal";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button2: {
    background: "#f2ba38",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
}));

const HistoricUser = () => {
  const classes = useStyles();

  const [tickets, setTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.post("/tickets_per_user");
        setTickets(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    fetchTickets();
  }, []);


  const onClose = () => {
    setOpenModal(false);
    setContactId(null);
  }

  const handleOptionsClick = (ticketId) => {
    setOpenModal(true);
    setContactId(ticketId);
  };

  return (
    <div className={classes.root}>
      <MainContainer className={classes.mainContainer}>
        <HistoricUserModal open={openModal} onClose={onClose} contactId={contactId} />
        <MainHeader />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Usuário</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Quantidade de Atendimentos</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Histórico de Atendimentos</th>
            </tr>
          </thead>
          <tbody>
            {tickets.tickets && tickets.tickets.map((ticket, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{ticket?.user?.name ? ticket?.user?.name : "VAZIO"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{ticket.QtdAtendimentos}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  <Button className={classes.button2} onClick={() => handleOptionsClick(ticket?.user.id)}>Opções</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MainContainer>
    </div>
  );
};

export default HistoricUser;
