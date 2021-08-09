import { Field, ErrorMessage, useFormikContext } from 'formik';

const Select = (props) => {
  const {label, name, options, ...rest } = props;

  const { setFieldValue } = useFormikContext();
 

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <Field
        className="form-select"
        as="select"
        id={name}
        name={name}
        {...rest}
        onChange={handleChange}      
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>

      <ErrorMessage component="div" name={name} className="error" />
    </div>
  );
};

export default Select;
