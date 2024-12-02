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
import toastError from "../../errors/toastError";

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
  const [searchParam, setSearchParam] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [schedules, dispatch] = useReducer(reducer, []);
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
      const { data } = await api.get("/ticket_service_schedules", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      // console.log(data.schedules);
      setTickets(data.schedules);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };


  const popularCards = () => {
    const filteredTickets = tickets;
    const lanes = [
      {
        id: "lane0",
        title: "MAPEAMENTO",
        cards: filteredTickets.map(ticket => ({
          title: "",
          id: ticket.id.toString(),
          description: (
            <div>
              <p>
                menssagem: {ticket.body}
                <br />
              </p>
              <p>
                link: {ticket.link}
                <br />
              </p>
              <button className={classes.button2} style={{ marginRight: '10px' }} onClick={() => handleCardEditClick(ticket.id)}>Atualizar</button>
              <button className={classes.button3} style={{ marginRight: '10px' }} onClick={() => handleCardClick(ticket.id)}>Deletar</button>
              <button className={classes.button3} style={{ backgroundColor: "green" }} onClick={() => handleCardClickSend(ticket.id)}>Salvar</button>
            </div>
          )
        })),
      }
    ];

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

      toast.success("Mensagem enviada com sucesso");

      // Redireciona o usuário para a página do kanban
    history.push({pathname:'/service_schedules', 
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
      await api.delete(`/ticket-tags/${targetLaneId}`);
      await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
      toast.success('Etiqueta do ticket adicionada com Sucesso!');

    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const fetchSchedules = useCallback(async () => {
    try {
      const { data } = await api.get("/ticket_service_schedules/", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  return (
    <div className={classes.root}>
      <MainContainer className={classes.mainContainer}>
        <MainHeader>
          <MainHeaderButtonsWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenScheduleModal}
            >
              ADICIONAR NOVO
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