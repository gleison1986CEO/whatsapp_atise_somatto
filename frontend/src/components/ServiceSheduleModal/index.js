import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { InputLabel, Tooltip } from "@material-ui/core";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Chip from '@material-ui/core/Chip';
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
import { FormControl, Grid, Hidden } from "@material-ui/core";
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
	contactId: Yup.number().required("Obrigatório"),
	sendAt: Yup.string().required("Obrigatório"),
});

const ScheduleModal = ({ open, onClose, scheduleId, contactId, cleanContact, reload, setUpdateLocation }) => {


	const classes = useStyles();
	const history = useHistory();
	const { user } = useContext(AuthContext);
	const [enableContact, setEnableContact] = useState(true);
	const [enableCsv, setEnableCsv] = useState(true);
	const [atendentes, setAtendentes] = useState([])

	const initialState = {
		body: "",
		contactId: "",
		sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
		perDay: 0,
		betweenDays: 0,
		periodStart: moment().format('HH:mm'),
		periodEnd: moment().add(3, 'hours').format('HH:mm'),
		sendAtStart: moment().format('DD-MM-YYYY'),
		sendAtEnd: moment().add(3, 'day').format('YYYY-MM-DD'),
		sentAt: "",
		qtdHours: 1,
		para_atendimento: 0,
		atendente: 0,
		fila: 0,
	};

	const initialContact = {
		id: "",
		name: ""
	}

	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [schedule, setSchedule] = useState(initialState);
	const [currentContact, setCurrentContact] = useState(initialContact);
	const [contacts, setContacts] = useState([initialContact]);
	const [attachment, setAttachment] = useState(null);
	const [attachmentCsv, setAttachmentCsv] = useState(null);
	const [queues, setQueues] = useState([])
	const [descUsers, setDescUsers] = useState([])
	const attachmentFile = useRef(null);
	const attachmentFileCsv = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userInfoModal, setUserInfoModal] = useState([]);

	useEffect(() => {
		const getAtendentes = async () => {
			const { data } = await api.get('/users');
			setAtendentes(data)
		}
		getAtendentes();
	}, [])

	useEffect(() => {
		const getQueues = async () => {
			const { data } = await api.get('/queue');
			setQueues(data)
		}
		getQueues();
	}, [])

	useEffect(() => {
		if (contactId && contacts.length) {
			const contact = contacts.find(c => c.id === contactId);
			if (contact) {
				setCurrentContact(contact);
			}
		}
	}, [contactId, contacts]);

	useEffect(() => {
		const { companyId } = user;
		if (open) {
			try {
				(async () => {
					const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
					let customList = contactList.map((c) => ({ id: c.id, name: c.name + " - PLATAFORMA" }));
					const { data: contactListHinova } = await api.post('/hinova_users');
					let customListHinova = contactListHinova.map((c) => ({ id: c.codigo_associado, name: c.nome + " - HINOVA" }));
					let combinedList = [{ id: "", name: "" }, ...customList, ...customListHinova];
					combinedList.sort((a, b) => a.name.localeCompare(b.name));
					if (isArray(combinedList)) {
						setContacts(combinedList);
					}
					if (contactId) {
						setSchedule(prevState => {
							return { ...prevState, contactId }
						});
					}

					if (!scheduleId) return;

					const { data } = await api.get(`/service_schedules/${scheduleId}`);
					setSchedule(prevState => {
						return {
							...prevState, ...data,
							sendAt: moment().format('YYYY-MM-DDTHH:mm'),
							sendAtStart: moment().format('YYYY-MM-DD'),
							sendAtEnd: moment().add(3, 'day').format('YYYY-MM-DD'),
							periodStart: moment().format('HH:mm'),
							periodEnd: moment().add(3, 'hours').format('HH:mm'),
							perDay: 0,
							betweenDays: 0,
							qtdHours: 1,
							para_atendimento: 0,
							atendente: 0,
							fila: 0
						};
					});
					//setCurrentContact(data.contact);
				})()
			} catch (err) {
				toastError(err);
			}
		}
	}, [scheduleId, contactId, open, user]);

	const handleClose = () => {

		setAttachment(null);
		onClose();
		setSchedule(initialState);
	};

	const handleAttachmentFile = (e) => {
		const file = head(e.target.files);
		if (file) {
			setAttachment(file);
		}
	};

	const descHinovaUserInfo = async (contacts) => {
		try {
			await Promise.all(contacts.map(async (contact) => {
				const { data } = await api.get(`/hinova_desc_user/${contact.id}`);
				if (data && data.veiculos && Array.isArray(data.veiculos)) {
					data.veiculos.forEach((veiculo) => {
						const groupedUsers = data.veiculos.reduce((acc, veiculo) => {
							const userKey = contact.name;
							if (!acc[userKey]) {
								acc[userKey] = [];
							}

							acc[userKey].push({
								usuario: contact.name,
								chassi: veiculo.chassi || '',
								placa: veiculo.placa || '',
								descrição: veiculo.descricao_modelo || ''
							});

							return acc;
						}, {});

						setDescUsers(prevUsers => ({
							...prevUsers,
							...groupedUsers
						}));
					});
				}
			}));
		} catch (error) {
			console.error("Error fetching vehicle data:", error);
			// toastError("Erro ao buscar dados dos veículos");
		}
	};

	const handleSaveSchedule = async values => {

		const scheduleData = { ...values, userId: user.id };

		scheduleData.hinovaContactName = scheduleData.contacts[0].name

		try {

			if (scheduleId && scheduleData.contacts != null) {

				await api.delete(`/service_schedules/${scheduleId}`);

				if (scheduleData.contacts.length > 0) {
					scheduleData.contacts.forEach(async (contact) => {
						const senderData = await api.post(`/service_schedules`, {
							...scheduleData,
							contactId: contact.id
						});

						if (attachment != null) {
							const formData = new FormData();
							formData.append("file", attachment);
							await api.post(
								`/service_schedules/${senderData.id}/media-upload`,
								formData
							);
						}
					});
				}
			} else {
				const { data } = await api.put(`/service_schedules/${scheduleId}`, scheduleData);
				if (attachment != null) {
					const formData = new FormData();
					formData.append("file", attachment);
					await api.post(`/service_schedules/${data.id}/media-upload`, formData);
				}
			}

			if (attachmentCsv != null) {
				const formData = new FormData();
				formData.append("file", attachmentCsv);
				formData.append("isCsv", true);
				await api.post(`/service_schedules/${scheduleId}/media-upload`, formData);
			}

			toast.success(i18n.t("scheduleModal.success"));
			if (typeof reload == 'function') {
				history.push({ pathname: '/service_schedules', state: { id: null } });
				reload();
			}

			if (contactId) {
				if (typeof cleanContact === 'function') {
					cleanContact();
					history.push({ pathname: '/service_schedules', state: { id: null } });
					reload();
				}
			}
		} catch (err) {
			console.log(err);

			toastError(err);
		}
		setCurrentContact(initialContact);
		setSchedule(initialState);
		handleClose();
	};

	const handleAttachmentFileCSV = (e) => {
		const file = head(e.target.files);
		if (file) {
			setAttachmentCsv(file);
		}
	};

	const deleteMedia = async () => {
		if (attachment) {
			setAttachment(null);
			attachmentFile.current.value = null;
		}

		if (schedule.mediaPath) {
			await api.delete(`/service_schedules/${schedule.id}/media-upload`);
			setSchedule((prev) => ({
				...prev,
				mediaPath: null,
			}));
			toast.success(i18n.t("announcements.toasts.deleted"));
			if (typeof reload == "function") {
				reload();
			}
		}
	};

	return (
		<div className={classes.root}>
			<ConfirmationModal
				title={i18n.t("announcements.confirmationModal.deleteTitle")}
				open={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
				onConfirm={deleteMedia}
			>
				{i18n.t("announcements.confirmationModal.deleteMessage")}
			</ConfirmationModal>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="md" // Change from "xs" to "md"
				fullWidth
				scroll="paper"
			// style={{ width: "200%" }} // Add this style
			>
				<DialogTitle id="form-dialog-title">
					<center>{schedule.status === 'ERRO' ? 'Erro no envio' : `Encaminhamento de mensagens`}</center>
				</DialogTitle>
				<Formik
					initialValues={schedule}
					enableReinitialize={true}
					validationSchema={ScheduleSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveSchedule(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent dividers>
								<Dialog
									open={isModalOpen}
									onClose={() => setIsModalOpen(false)}
									maxWidth="sm"
									fullWidth
								>
									<DialogTitle>
										{userInfoModal[0]?.usuario}
									</DialogTitle>
									<DialogContent>
										{userInfoModal && userInfoModal.map((userInfo, key) => (
											<div key={key}>
												<p>placa_{key + 1}: {userInfo.placa}</p>
												<p>chassi_{key + 1}: {userInfo.chassi}</p>
												<p>descrição_{key + 1}: {userInfo.descrição}</p>
												<br />
											</div>
										))}
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setIsModalOpen(false)} color="primary">
											Fechar
										</Button>
									</DialogActions>
								</Dialog>
								<div className={classes.multFieldLine}>
									<FormControl
										variant="outlined"
										fullWidth
									>
										<Autocomplete
											fullWidth
											multiple
											style={{ display: enableContact ? "" : "none" }}
											options={contacts}
											getOptionLabel={(option) => option.name}
											onChange={(e, selectedContacts) => {
												setSchedule({
													...schedule,
													contacts: selectedContacts,
												});
												if (selectedContacts.length > 0) {
													setCurrentContact(selectedContacts[selectedContacts.length - 1]);
												} else {
													setCurrentContact(initialContact);
												}
												descHinovaUserInfo(selectedContacts);
												setEnableCsv(!enableCsv);
											}}
											renderInput={(params) => (
												<TextField {...params} variant="outlined" placeholder="Contato" />
											)}
											renderTags={(selected, getTagProps) =>
												selected.map((option, index) => (
													<Chip
														{...getTagProps({ index })}
														key={option.id}
														label={option.name}
														style={{
															backgroundColor: 'green',
															color: 'white',
															fontWeight: 'bold',
														}}
													/>
												))
											}
										/>
										<Tooltip title="Adicionar contatos a partir de CSV" placement="bottom">
											<Button
												style={{ marginTop: 15, display: enableCsv ? "" : "none" }}
												color="primary"
												onClick={() => {
													setEnableContact(!enableContact)
													attachmentFileCsv.current.click()
												}}
												disabled={isSubmitting}
												variant="outlined"
											>
												CONTATOS CSV
											</Button>
										</Tooltip>
										<Autocomplete
											fullWidth
											style={{ display: "none" }}
											value={currentContact}
											options={contacts}
											onChange={(e, contact) => {
												const contactId = contact ? contact.id : '';
												setSchedule({ ...schedule, contactId });
												setCurrentContact(contact ? contact : initialContact);
											}}
											getOptionLabel={(option) => option.name}
											getOptionSelected={(option, value) => {
												return value.id === option.id
											}}
											renderInput={(params) => <TextField {...params} variant="outlined"
												placeholder="Contato" />}
										/>
										<div style={{ display: "none" }}>
											<input
												type="file"
												accept=".csv"
												ref={attachmentFileCsv}
												onChange={(e) => handleAttachmentFileCSV(e)}
											/>
										</div>
									</FormControl>
								</div>
								<br />
								<div>
									<Field
										as={TextField}
										rows={9}
										multiline={true}
										label={i18n.t("scheduleModal.form.body")}
										name="body"
										error={touched.body && Boolean(errors.body)}
										helperText={touched.body && errors.body}
										variant="outlined"
										margin="dense"
										fullWidth
										style={{ display: "none" }}
									/>
								</div>
								<br />
								<div>
									<Field
										as={TextField}
										label={i18n.t("scheduleModal.form.link")}
										type="text"
										name="link"
										variant="outlined"
										margin="dense"
										fullWidth
										style={{ display: "none" }}
									/>
								</div>
								<br />
								<div style={{ display: "none" }}>
									<input
										type="file"
										accept=".png,.jpg,.jpeg,.mp4"
										ref={attachmentFile}
										onChange={(e) => handleAttachmentFile(e)}
									/>
								</div>
								<div className={classes.multFieldLine}>
									{(schedule.mediaPath || attachment) && (
										<Grid xs={12} item>
											<Button style={{ display: "none" }} startIcon={<AttachFileIcon />}>
												{attachment ? attachment.name : schedule.mediaName}
											</Button>
											<IconButton
												onClick={() => setConfirmationOpen(true)}
												color="secondary"
											>
												<DeleteOutlineIcon />
											</IconButton>
										</Grid>
									)}
									{!attachment && !schedule.mediaPath && (
										<Button
											style={{ display: "none" }}
											color="primary"
											onClick={() => attachmentFile.current.click()}
											disabled={isSubmitting}
											variant="outlined"
										>
											{i18n.t("announcements.dialog.buttons.attach")}
										</Button>
									)}
								</div>
								<div>
									<InputLabel htmlFor="qtdHours">Informações do usuário</InputLabel>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row', gap: '8px', flexWrap: 'wrap' }}>
									{Object.entries(descUsers).map(([usuario, veiculos]) => (
										<Button
											key={usuario}
											variant="contained"
											onClick={() => [setIsModalOpen(true), setUserInfoModal(veiculos)]}
											style={{
												backgroundColor: 'green',
												color: 'white',
												margin: '4px'
											}}
										>
											{usuario} ({veiculos.length})
										</Button>
									))}
								</div>
								<br />
								<div className={classes.multFieldLine}>
									<div style={{ width: '50%', marginRight: '8px' }}>
										<div>
											<InputLabel>Atendente</InputLabel>
										</div>
										<Field
											as="select"
											name="atendente"
											onChange={(e) => {
												setSchedule({ ...schedule, atendente: e.target.value })
											}}
											style={{
												padding: "15px",
												width: "100%",
												border: "1px solid #c4c4c4",
												borderRadius: "4px"
											}}
										>
											<option key="0" value="0">
												Selecione
											</option>
											{atendentes.users && atendentes.users.map((value, i) => (
												<option key={value.id} value={value.id}>
													{value.name}
												</option>
											))}
										</Field>
									</div>
									<div style={{ width: '50%', marginRight: '8px' }}>
										<div>
											<InputLabel>Fila</InputLabel>
										</div>
										<Field
											as="select"
											name="fila"
											onChange={(e) => {
												setSchedule({ ...schedule, fila: e.target.value })
											}}
											style={{
												padding: "15px",
												width: "100%",
												border: "1px solid #c4c4c4",
												borderRadius: "4px"
											}}
										>
											<option key={0} value={0}>
												Selecione
											</option>
											{queues && queues.map((value, i) => (
												<option key={value.id} value={value.id}>
													{value.name}
												</option>
											))}
										</Field>
									</div>
								</div>
								<br />
								<div className={classes.multFieldLine}>
									<Tooltip title="Quantidade de envios em um dia" placement="bottom">
										<Field
											as={TextField}
											type="number"
											label="Envios por dia"
											name="perDay"
											defaultValue={0}
											onChange={(e) => {
												setSchedule({ ...schedule, perDay: e.target.value });
											}}
											InputLabelProps={{
												shrink: true,
											}}
											variant="outlined"
											fullWidth
										/>
									</Tooltip>
									<Tooltip title="Intervalo entre dias que serão enviadas as mensagens" placement="bottom">
										<Field
											as={TextField}
											type="number"
											label="Intervalo de dias"
											name="intervalo"
											defaultValue={0}
											onChange={(e) => {
												setSchedule({ ...schedule, betweenDays: e.target.value });
											}}
											InputLabelProps={{
												shrink: true,
											}}
											variant="outlined"
											fullWidth
										/>
									</Tooltip>
								</div>
								<br />
								<div>
									<InputLabel htmlFor="qtdHours">De quanto em quanto tempo</InputLabel>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as="select"
										label="De quanto em quanto tempo"
										name="qtdHours"
										onChange={(e) => {
											setSchedule({ ...schedule, qtdHours: e.target.value });
										}}
										style={{
											padding: "15px",
											width: "100%",
											border: "1px solid #c4c4c4",
											borderRadius: "4px"
										}}
									>
										{[...Array(12)].map((_, i) => (
											<option key={i + 1} value={i + 1}>
												{i + 1} {i + 1 === 1 ? 'hora' : 'horas'}
											</option>
										))}
									</Field>
								</div>
								<br />
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Período Inicial"
										type="time"
										name="periodStart"
										onChange={(e) => {
											setSchedule({ ...schedule, periodStart: e.target.value });
										}}
										defaultValue={moment().format('HH:mm')}
										InputLabelProps={{
											shrink: true,
										}}
										variant="outlined"
										fullWidth
									/>
									<Field
										as={TextField}
										label="Período Final"
										type="time"
										name="periodEnd"
										defaultValue={new Date().toISOString().slice(11, 16)}
										onChange={(e) => {
											setSchedule({ ...schedule, periodEnd: e.target.value });
										}}
										InputLabelProps={{
											shrink: true,
										}}
										variant="outlined"
										fullWidth
									/>
								</div>
								<br />
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Data Inicial"
										defaultValue={moment().format('DD-MM-YYYY')}
										type="date"
										name="sendAtStart"
										onChange={(e) => {
											setSchedule({ ...schedule, sendAtStart: e.target.value });
										}}
										InputLabelProps={{
											shrink: true,
										}}
										error={touched.sendAtStart && Boolean(errors.sendAtStart)}
										helperText={touched.sendAtStart && errors.sendAtStart}
										variant="outlined"
										fullWidth
									/>
									<Field
										as={TextField}
										label="Data Final"
										type="date"
										name="sendAtEnd"
										onChange={(e) => {
											setSchedule({ ...schedule, sendAtEnd: e.target.value });
										}}
										defaultValue={moment().add(3, 'days').format('YYYY-MM-DD')}
										InputLabelProps={{
											shrink: true,
										}}
										error={touched.sendAtEnd && Boolean(errors.sendAtEnd)}
										helperText={touched.sendAtEnd && errors.sendAtEnd}
										variant="outlined"
										fullWidth
									/>

								</div>
							</DialogContent>
							<DialogActions>


								{(schedule.sentAt === null || schedule.sentAt === "") && (
									<Button
										type="submit"
										color="primary"
										disabled={isSubmitting}
										variant="contained"
										className={classes.btnWrapper}
										style={{ backgroundColor: "green", color: "#ffffff", width: "100%", maxWidth: "300px", margin: "0 auto" }}
									>
										{scheduleId
											? `ENCAMINHAR MENSAGEM`
											: `ENCAMINHAR MENSAGEM`}
										{isSubmitting && (
											<CircularProgress
												size={24}
												className={classes.buttonProgress}
											/>
										)}
									</Button>

								)}
							</DialogActions>
							<DialogActions>
								<Button
									className={classes.btnWrapper}
									style={{ backgroundColor: "green", color: "#ffffff", width: "100%", maxWidth: "300px", margin: "0 auto" }}
									href="kanban_services"
								>VOLTAR</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default ScheduleModal;