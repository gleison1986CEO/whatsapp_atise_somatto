import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl, Grid } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment"
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize, head } from "lodash";
import serviceShedules from "../../pages/ServiceShedules";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ConfirmationModal from "../ConfirmationModal";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

const ScheduleSchema = Yup.object().shape({
	body: Yup.string()
		.min(5, "Mensagem muito curta")
		.required("Obrigatório"),
	// contactId: Yup.number().required("Obrigatório"),
	sendAt: Yup.string().required("Obrigatório")
});

const HistoricUserModal = ({ open, onClose, contactId }) => {

	const classes = useStyles();
	const history = useHistory();
	const { user } = useContext(AuthContext);

	const initialState = {
		body: "",
		contactId: "",
		sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
		sentAt: "",
	};

	const initialContact = {
		id: "",
		name: ""
	}

	const initialFilter = {
		id: "",
		name: ""
	}

	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [schedule, setSchedule] = useState(initialState);
	const [currentContact, setCurrentContact] = useState(initialContact);
	const [contacts, setContacts] = useState([initialContact]);
	const [filterName, setFilterName] = useState([initialFilter]);
	const [attachment, setAttachment] = useState(null);
	const attachmentFile = useRef(null);

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const response = await api.post("/tickets_per_user", { userId: contactId });
				setContacts(response.data);
			} catch (error) {
				toastError(error);
			}
		};
		fetchContacts();
	}, []);

	const handleClose = () => {
		setAttachment(null);
		onClose();
		setSchedule(initialState);
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					Histórico do Usuário
				</DialogTitle>
				<DialogContent>
					<div style={{ maxHeight: "400px", overflowY: "auto" }}>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr>
									<th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Usuário</th>
									<th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Mensagem</th>
								</tr>
							</thead>
							<tbody>
								{contacts.count && contacts.count.map((contact, index) => (
									<tr key={index}>
										<td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{contact?.name ? contact?.name : "VAZIO"}</td>
										<td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{contact?.lastMessage}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</DialogContent>
			</Dialog>
		</div >
	);
};

export default HistoricUserModal;