import Input from "../Input/Input";
import PasswordInput from "../PasswordInput/PasswordInput";
import Textarea from "../Textarea/Textarea";
import Select from "../select/Select";
import Checkbox from "../Checkbox/Checkbox";
import Switch from "../Switch/Switch";
import FileUpload from "../FileUpload/FileUpload";


const FormField = ({
    config,

    field,

    error = "", 

    

    disabled = false,
}) => {
    if (!config) {
        return null;
    }


    const {
        type = "text",

        label,
        placeholder,
        helperText,

        required = false,

        options = [],

        rows = 4,

        existingPreview = "",

        className = "",
        wrapperClassName = "",

        componentProps = {},
    } = config;


    const isDisabled =
        disabled ||
        config.disabled ||
        false;


    // =========================
    // PASSWORD
    // =========================
    if (type === "password") {
        return (
            <PasswordInput
                {...field}

                label={label}

                placeholder={
                    placeholder
                }

                error={error}

                helperText={
                    helperText
                }

                required={required}

                disabled={
                    isDisabled
                }

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // TEXTAREA
    // =========================
    if (type === "textarea") {
        return (
            <Textarea
                {...field}

                label={label}

                placeholder={
                    placeholder
                }

                error={error}

                helperText={
                    helperText
                }

                required={required}

                disabled={
                    isDisabled
                }

                rows={rows}

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // SELECT
    // =========================
    if (type === "select") {
        return (
            <Select
                {...field}

                label={label}

                placeholder={
                    placeholder
                }

                options={options}

                error={error}

                helperText={
                    helperText
                }

                required={required}

                disabled={
                    isDisabled
                }

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // CHECKBOX
    // =========================
    if (type === "checkbox") {
        return (
            <Checkbox
                ref={field.ref}

                name={field.name}

                checked={
                    Boolean(field.value)
                }

                onBlur={
                    field.onBlur
                }

                onChange={(event) => {
                    field.onChange(
                        event.target.checked
                    );
                }}

                label={label}

                description={
                    helperText
                }

                error={error}

                required={required}

                disabled={
                    isDisabled
                }

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // SWITCH
    // =========================
    if (type === "switch") {
        return (
            <Switch
                ref={field.ref}

                name={field.name}

                checked={
                    Boolean(field.value)
                }

                onChange={(
                    checked
                ) => {
                    field.onChange(
                        checked
                    );
                }}

                label={label}

                description={
                    helperText
                }

                error={error}

                disabled={
                    isDisabled
                }

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // FILE / IMAGE
    // =========================
    if (type === "file") {
        return (
            <FileUpload
                label={label}

                error={error}

                helperText={
                    helperText
                }

                required={required}

                disabled={
                    isDisabled
                }

                existingPreview={
                    existingPreview
                }

                onChange={(file) => {
                    field.onChange(
                        file
                    );
                }}

                className={
                    className
                }

                wrapperClassName={
                    wrapperClassName
                }

                {...componentProps}
            />
        );
    }


    // =========================
    // DEFAULT INPUT
    // =========================
    return (
        <Input
            {...field}

            type={type}

            label={label}

            placeholder={
                placeholder
            }

            error={error}

            helperText={
                helperText
            }

            required={required}

            disabled={
                isDisabled
            }

            className={
                className
            }

            wrapperClassName={
                wrapperClassName
            }

            {...componentProps}
        />
    );
};


export default FormField;