import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import { socketConnection } from "../../services/socket";
import { Button } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import KambamServiceModal from "../../components/KambanServiceModal";
import NameKambanServiceModal from "../../components/NameKambanServiceModal";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  button2: {
    background: "#f2ba38",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  button3: {
    background: "red",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },

}));


const KanbanService = () => {
  const classes = useStyles();
  const history = useHistory();

  const getUrlParam = (param) => {
    return new URLSearchParams(window.location.search).get(param);
  };

  const reducer = (state, action) => {
    if (action.type === "LOAD_SCHEDULES") {
      const schedules = action.payload;
      const newSchedules = [];

      schedules.forEach((schedule) => {
        const scheduleIndex = state.findIndex((s) => s.id === schedule.id);
        if (scheduleIndex !== -1) {
          state[scheduleIndex] = schedule;
        } else {
          newSchedules.push(schedule);
        }
      });

      return [...state, ...newSchedules];
    }

    if (action.type === "UPDATE_SCHEDULES") {
      const schedule = action.payload;
      const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

      if (scheduleIndex !== -1) {
        state[scheduleIndex] = schedule;
        return [...state];
      } else {
        return [schedule, ...state];
      }
    }

    if (action.type === "DELETE_SCHEDULE") {
      const scheduleId = action.payload;

      const scheduleIndex = state.findIndex((s) => s.id === scheduleId);
      if (scheduleIndex !== -1) {
        state.splice(scheduleIndex, 1);
      }
      return [...state];
    }

    if (action.type === "RESET") {
      return [];
    }
  };

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam("contactId"));
  const [reloadData, setReloadData] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleNameModalOpen, setScheduleNameModalOpen] = useState(false);
  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || [];
      //console.log(response);
      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanContact = () => {
    setContactId("");
  };



  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({ lanes: [] });

  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const fetchTickets = async (jsonString) => {
    try {
      const getTickets = await api.get("/ticket_service_schedules_ticket");
      setTickets(getTickets.data.rows);
      // setTickets(data.schedules);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };


  const popularCards = () => {
    const filteredTickets = tickets;

    // {
    //   id: "lane0",
    //     title: "SERVIÇO A",
    //       cards: filteredTickets.map(ticket => ({
    //         title: "",
    //         id: ticket.id.toString(),
    //         description: (

    //           <div>
    //             <p>
    //               TEXTO: {ticket.body}
    //               <br />
    //               <br />
    //               LINK: {ticket.link}
    //             </p>

    //             <center><button className={classes.button3} style={{ backgroundColor: "green", width: "100%", maxWidth: "300px", margin: "0 auto" }} onClick={() => handleCardClickSend(ticket.id)}>Encaminhar Serviço</button></center>
    //             <center><button className={classes.button2} style={{ marginRight: '10px', width: "100%", maxWidth: "300px", margin: "0 auto", marginTop: "10px" }} onClick={() => handleCardEditClick(ticket.id)}>Atualizar Serviço</button></center>
    //             <center><button className={classes.button3} style={{ marginRight: '10px', width: "100%", maxWidth: "300px", margin: "0 auto", marginTop: "10px" }} onClick={() => handleCardClick(ticket.id)}>Deletar Serviço</button></center>

    //           </div>
    //         )
    //       })),
    //   }

    const lanes = filteredTickets.map((filtered) => {
      console.log(filtered);

      return {
        id: filtered.id,
        title: filtered.filterName,
        cards: filtered.ticketScheduleService.map(ticket => ({
          title: "",
          id: ticket.id.toString(),
          description: (

            <div>
              <p>
                TEXTO: {ticket.body}
                <br />
                <br />
                LINK: {ticket.link}
              </p>

              <center><button className={classes.button3} style={{ backgroundColor: "green", width: "100%", maxWidth: "300px", margin: "0 auto" }} onClick={() => handleCardClickSend(ticket.id)}>Encaminhar Serviço</button></center>
              <center><button className={classes.button2} style={{ marginRight: '10px', width: "100%", maxWidth: "300px", margin: "0 auto", marginTop: "10px" }} onClick={() => handleCardEditClick(ticket.id)}>Atualizar Serviço</button></center>
              <center><button className={classes.button3} style={{ marginRight: '10px', width: "100%", maxWidth: "300px", margin: "0 auto", marginTop: "10px" }} onClick={() => handleCardClick(ticket.id)}>Deletar Serviço</button></center>

            </div>
          )
        })),
      };
    });


    setFile({ lanes });
  };

  const handleCardClick = async (uuid) => {
    //console.log("Clicked on card with UUID:", uuid);
    toast.success(i18n.t("announcements.toasts.deleted"));
    await api.delete(`/ticket_service_schedules/${uuid}`);
    await fetchTickets();
    // history.push('/kanban_services');
  };

  const handleCardClickSend = async (uuid) => {
    try {
      // Obtém os dados do ticket pelo UUID
      const { data } = await api.get(`/ticket_service_schedules/${uuid}`);
      console.log('Dados recebidos do ticket:', data);

      // data.sendAt = "0000-00-00 00:00:00.000";
      // Envia os dados para criar um novo service_schedule
      const sendData = await api.post("/service_schedules", data);

      toast.success("Serviço anexado com sucesso!");

      // Redireciona o usuário para a página do kanban
      history.push({
        pathname: '/service_schedules',
        state: {  // location state
          id: sendData.data.id
        }
      });

    } catch (error) {
      console.error('Erro ao processar a solicitação:', error);
      alert('Houve um erro ao tentar processar a solicitação. Tente novamente.');
    }
  };


  const handleCardEditClick = async (uuid) => {
    console.log("SCHEDULEID", uuid);

    setSelectedSchedule(uuid);
    setScheduleModalOpen(true);
    await fetchTickets();
  };

  useEffect(() => {
    popularCards(jsonString);
  }, [tags, tickets, reloadData]);




  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {

      let { data } = await api.get(`/ticket_service_schedules/${targetLaneId}`);

      data.filterId = sourceLaneId

      await api.put(`/ticket_service_schedules/${targetLaneId}`, data);
      toast.success('Etiqueta do ticket modificada com Sucesso!');

    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleOpenScheduleNameModal = () => {
    setSelectedSchedule(null);
    setScheduleNameModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const handleCloseScheduleNameModal = () => {
    setSelectedSchedule(null);
    setScheduleNameModalOpen(false);
  };

  return (
    <div className={classes.root}>
      <MainContainer className={classes.mainContainer}>
        <MainHeader>
          <MainHeaderButtonsWrapper>
            <Button
              style={{ marginRight: "7px" }}
              variant="contained"
              color="primary"
              onClick={handleOpenScheduleModal}
            >
              NOVO SERVIÇO
            </Button>
            <Button
              style={{ marginRight: "7px" }}
              variant="contained"
              color="primary"
              onClick={handleOpenScheduleNameModal}
            >
              NOVA COLUNA
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push("/service_schedules_manager")}
            >
              GERENCIAR SERVIÇOS AGENDADOS
            </Button>
          </MainHeaderButtonsWrapper>
        </MainHeader>
        <KambamServiceModal
          open={scheduleModalOpen}
          onClose={handleCloseScheduleModal}
          reload={fetchTickets}
          aria-labelledby="form-dialog-title"
          scheduleId={selectedSchedule}
          // contactId={contactId}
          cleanContact={cleanContact}
        />
        <NameKambanServiceModal
          open={scheduleNameModalOpen}
          onClose={handleCloseScheduleNameModal}
          reload={fetchTickets}
          aria-labelledby="form-dialog-title"
          scheduleId={selectedSchedule}
          // contactId={contactId}
          cleanContact={cleanContact}
        />
        <Board
          data={file}
          onCardMoveAcrossLanes={handleCardMove}
          style={{ backgroundColor: 'rgba(252, 252, 252, 0.03)' }}
        />
      </MainContainer>
    </div>
  );
};


export default KanbanService;