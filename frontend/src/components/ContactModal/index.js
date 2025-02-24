import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginRight: theme.spacing(1),
		flex: 1,
	},

	extraAttr: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
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
}));

const ContactSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email"),
});

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
	const classes = useStyles();
	const isMounted = useRef(true);

	const initialState = {
		name: "",
		number: "",
		email: "",
	};

	const [contact, setContact] = useState(initialState);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchContact = async () => {
			if (initialValues) {
				setContact(prevState => {
					return { ...prevState, ...initialValues };
				});
			}

			if (!contactId) return;

			try {
				const { data } = await api.get(`/contacts/${contactId}`);
				if (isMounted.current) {
					setContact(data);
				}
			} catch (err) {
				toastError(err);
			}
		};

		fetchContact();
	}, [contactId, open, initialValues]);

	const handleClose = () => {
		onClose();
		setContact(initialState);
	};

	const handleSaveContact = async values => {
		try {
			if (contactId) {
				await api.put(`/contacts/${contactId}`, values);
				handleClose();
			} else {
				const { data } = await api.post("/contacts", values);
				if (onSave) {
					onSave(data);
				}
				handleClose();
			}
			toast.success(i18n.t("contactModal.success"));
		} catch (err) {
			toastError(err);
		}
	};

	return (
		<div className={classes.root}>
			<Dialog open={open} onClose={handleClose} maxWidth="lg" scroll="paper">
				<DialogTitle id="form-dialog-title">
					{contactId
						? `${i18n.t("contactModal.title.edit")}`
						: `${i18n.t("contactModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={contact}
					enableReinitialize={true}
					validationSchema={ContactSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveContact(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, errors, touched, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<Typography variant="subtitle1" gutterBottom>
									{i18n.t("contactModal.form.mainInfo")}
								</Typography>
								<Field
									as={TextField}
									label={i18n.t("contactModal.form.name")}
									name="name"
									autoFocus
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
									variant="outlined"
									margin="dense"
									className={classes.textField}
								/>
								<Field
									as={TextField}
									label={i18n.t("contactModal.form.number")}
									name="number"
									error={touched.number && Boolean(errors.number)}
									helperText={touched.number && errors.number}
									placeholder="5513912344321"
									variant="outlined"
									margin="dense"
								/>
								<div>
									<Field
										as={TextField}
										label={i18n.t("contactModal.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										placeholder="Email address"
										fullWidth
										margin="dense"
										variant="outlined"
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="CPF"
										name="cpf"
										placeholder="CPF"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Data de Nascimento"
										name="data_nascimento"
										placeholder="CPF"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="RG"
										name="rg"
										placeholder="RG"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="CNH"
										name="cnh"
										placeholder="CNH"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Categoria CNH"
										name="categoria_cnh"
										placeholder="Categoria CNH"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Data Venc da CNH"
										name="data_vencimento_habilitacao"
										placeholder="Data Venc da CNH"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Telefone Celular"
										name="telefone_celular"
										placeholder="Telefone Celular"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="CEP"
										name="cep"
										placeholder="CEP"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Logradouro"
										name="logradouro"
										placeholder="Logradouro"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Numero"
										name="numero"
										placeholder="Numero"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Complemento"
										name="complemento"
										placeholder="Complemento"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Bairro"
										name="bairro"
										placeholder="Bairro"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Cidade"
										name="cidade"
										placeholder="Cidade"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Estado"
										name="estado"
										placeholder="Estado"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/><Field
										as={TextField}
										label="SPC Serasa"
										name="spcSerasa"
										placeholder="SPC Serasa"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Tipo de Cobrança Recorrente"
										name="descricao_tipo_cobranca_recorrente"
										placeholder="Tipo de Cobrança Recorrente"
										margin="dense"
										fullWidth
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Placa 1"
										name="veiculo_placa_1"
										placeholder="Placa 1"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/><Field
										as={TextField}
										label="Placa 2"
										name="veiculo_placa_2"
										placeholder="Placa 2"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/><Field
										as={TextField}
										label="Placa 3"
										name="veiculo_placa_3"
										placeholder="Placa 3"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/><Field
										as={TextField}
										label="Placa 4"
										name="veiculo_placa_4"
										placeholder="Placa 4"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/><Field
										as={TextField}
										label="Placa 5"
										name="veiculo_placa_5"
										placeholder="Placa 5"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Placa 6"
										name="veiculo_placa_6"
										placeholder="Placa 6"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Chassi 1"
										name="veiculo_chassi_1"
										placeholder="Chassi 1"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Chassi 2"
										name="veiculo_chassi_2"
										placeholder="Chassi 2"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Chassi 3"
										name="veiculo_chassi_3"
										placeholder="Chassi 3"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Chassi 4"
										name="veiculo_chassi_4"
										placeholder="Chassi 4"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>

									<Field
										as={TextField}
										label="Chassi 5"
										name="veiculo_chassi_5"
										placeholder="Chassi 5"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Chassi 6"
										name="veiculo_chassi_6"
										placeholder="Chassi 6"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Fipe 1"
										name="veiculo_fipe_1"
										placeholder="Fipe 1"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Fipe 2"
										name="veiculo_fipe_2"
										placeholder="Fipe 2"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Fipe 3"
										name="veiculo_fipe_3"
										placeholder="Fipe 3"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>
									<Field
										as={TextField}
										label="Fipe 4"
										name="veiculo_fipe_4"
										placeholder="Fipe 4"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Fipe 5"
										name="veiculo_fipe_5"
										placeholder="Fipe 5"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Fipe 6"
										name="veiculo_fipe_6"
										placeholder="Fipe 6"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Descrição do Modelo 1"
										name="veiculo_descricao_modelo_1"
										placeholder="Descrição do Modelo 1"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label="Descrição do Modelo 2"
										name="veiculo_descricao_modelo_2"
										placeholder="Descrição do Modelo 2"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<div>

									<Field
										as={TextField}
										label="Descrição do Modelo 3"
										name="veiculo_descricao_modelo_3"
										placeholder="Descrição do Modelo 3"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>									<Field
										as={TextField}
										label="Descrição do Modelo 4"
										name="veiculo_descricao_modelo_4"
										placeholder="Descrição do Modelo 4"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>									<Field
										as={TextField}
										label="Descrição do Modelo 5"
										name="veiculo_descricao_modelo_5"
										placeholder="Descrição do Modelo 5"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>									<Field
										as={TextField}
										label="Descrição do Modelo 6"
										name="veiculo_descricao_modelo_6"
										placeholder="Descrição do Modelo 6"
										margin="dense"
										variant="outlined"
										className={classes.textField}
									/>
								</div>
								<Typography
									style={{ marginBottom: 8, marginTop: 12 }}
									variant="subtitle1"
								>
									{i18n.t("contactModal.form.extraInfo")}
								</Typography>

								<FieldArray name="extraInfo">
									{({ push, remove }) => (
										<>
											{values.extraInfo &&
												values.extraInfo.length > 0 &&
												values.extraInfo.map((info, index) => (
													<div
														className={classes.extraAttr}
														key={`${index}-info`}
													>
														<Field
															as={TextField}
															label={i18n.t("contactModal.form.extraName")}
															name={`extraInfo[${index}].name`}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
														<Field
															as={TextField}
															label={i18n.t("contactModal.form.extraValue")}
															name={`extraInfo[${index}].value`}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
														<IconButton
															size="small"
															onClick={() => remove(index)}
														>
															<DeleteOutlineIcon />
														</IconButton>
													</div>
												))}
											<div className={classes.extraAttr}>
												<Button
													style={{ flex: 1, marginTop: 8 }}
													variant="outlined"
													color="primary"
													onClick={() => push({ name: "", value: "" })}
												>
													{`+ ${i18n.t("contactModal.buttons.addExtraInfo")}`}
												</Button>
											</div>
										</>
									)}
								</FieldArray>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("contactModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{contactId
										? `${i18n.t("contactModal.buttons.okEdit")}`
										: `${i18n.t("contactModal.buttons.okAdd")}`}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default ContactModal;
