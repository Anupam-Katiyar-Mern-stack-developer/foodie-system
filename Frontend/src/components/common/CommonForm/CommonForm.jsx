import {
    Controller,
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import FormField from "../FormField/FormField";
import FormActions from "../FormActions/FormActions";


const CommonForm = ({
    fields = [],

    schema = null,

    defaultValues = {},

    onSubmit,
    onCancel,

    loading = false,
    disabled = false,

    submitText = "Save",
    loadingText = "Saving...",

    cancelText = "Cancel",
    showCancel = true,

    columns = 2,

    beforeFields = null,
    afterFields = null,

    onInvalid,

    formClassName = "",
    fieldsClassName = "",
    actionsClassName = "",
}) => {

    const form = useForm({
        defaultValues,

        resolver: schema
            ? zodResolver(schema)
            : undefined,

        mode: "onTouched",

        reValidateMode:
            "onChange",
    });


    const {
        control,

        handleSubmit,

        formState: {
            errors,
            isSubmitting,
            isDirty,
        },
    } = form;


    /*
      Parent loading +
      React Hook Form submitting.
  
      API loading normally Redux
      se aayega.
  
      isSubmitting async submit
      ke liye extra protection hai.
    */
    const isFormLoading =
        loading || isSubmitting;


    const isFormDisabled =
        disabled || isFormLoading;


    const gridColumns = {
        1: "grid-cols-1",

        2: `
      grid-cols-1
      md:grid-cols-2
    `,

        3: `
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
    `,
    };


    const handleValidSubmit =
        async (values) => {
            if (!onSubmit) return;

            /*
              form methods bhi parent ko
              de rahe hain.
      
              Later backend field error aaye:
              form.setError(...)
              use kar sakte hain.
            */
            await onSubmit(
                values,
                form
            );
        };


    return (
        <form
            noValidate

            onSubmit={handleSubmit(
                handleValidSubmit,
                onInvalid
            )}

            className={`
        w-full
        space-y-6

        ${formClassName}
      `}
        >
            {/* ======================
          OPTIONAL TOP CONTENT
      ====================== */}
            {beforeFields}


            {/* ======================
          FORM FIELDS
      ====================== */}
            <div
                className={`
          grid
          gap-5

          ${gridColumns[
                    columns
                    ] ||
                    gridColumns[2]
                    }

          ${fieldsClassName}
        `}
            >
                {fields.map(
                    (config) => {

                        if (
                            !config ||
                            !config.name ||
                            config.hidden
                        ) {
                            return null;
                        }


                        const {
                            name,

                            fullWidth =
                            false,

                            fieldClassName =
                            "",
                        } = config;


                        return (
                            <div
                                key={name}

                                className={`
                  min-w-0

                  ${fullWidth
                                        ? "md:col-span-full"
                                        : ""
                                    }

                  ${fieldClassName}
                `}
                            >
                                <Controller
                                    name={name}

                                    control={
                                        control
                                    }

                                    render={({
                                        field,
                                        fieldState: {
                                            error,
                                        },
                                    }) => (
                                        <FormField
                                            config={
                                                config
                                            }

                                            field={
                                                field
                                            }

                                            error={
                                                error
                                                    ?.message ||
                                                ""
                                            }

                                            disabled={
                                                isFormDisabled
                                            }
                                        />
                                    )}
                                />
                            </div>
                        );
                    }
                )}
            </div>


            {/* ======================
          OPTIONAL EXTRA AREA
      ====================== */}
            {afterFields}


            {/* ======================
          FORM ACTIONS
      ====================== */}
            <FormActions
                onCancel={
                    onCancel
                }

                submitText={
                    submitText
                }

                loadingText={
                    loadingText
                }

                cancelText={
                    cancelText
                }

                showCancel={
                    showCancel
                }

                loading={
                    isFormLoading
                }

                disabled={
                    disabled
                }

                className={
                    actionsClassName
                }
            />
        </form>
    );
};


export default CommonForm;