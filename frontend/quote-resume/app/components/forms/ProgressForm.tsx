import { useEffect, useState } from "react"
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

interface IForm {
  fname: string;
  lname: string;
  reason: string;
  message: string;
}

export default function ProgressForm() {
  const [progress, setProgress] = useState(0);
  const { register, handleSubmit, control, formState: { errors } } = useForm<IForm>({
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<IForm> = (data, evt: React.SubmitEvent) => {
    evt.preventDefault();
    console.log(data);
  }
  const trackedFields: Array<"fname" | "lname" | "reason" | "message"> = ['fname', "lname", "reason", "message"];
  const formValues = useWatch({
    control,
    name: trackedFields
  });

  const calculatePercentage = (validFields: number) => Math.round((validFields / trackedFields.length) * 100);;

  useEffect(() => {
    const completedCount = trackedFields.reduce((count, fieldName, index) => {
      const value = formValues[index];
      const hasError = !!errors[fieldName];

      if (value && !hasError) {
        return count + 1;
      }
      return count;
    }, 0);
    console.log(`Valid and completed fileds: ${completedCount}`);
    const completionPercentage = calculatePercentage(completedCount);
    console.log(`Completed fields: ${completionPercentage}`);
    setProgress(completionPercentage);
  }, [formValues, errors, trackedFields]);


  return (<>
    <form id="progress-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label htmlFor="fname">
          First name
          <input id="fname" {...register("fname", { required: true, minLength: 2, maxLength: 40, pattern: /^[A-Za-z]+$/i })} />
          {errors.fname && <span style={{ color: "red" }}>This field is required</span>}
        </label>
      </div>
      <div className="form-control">
        <label htmlFor="lname">
          Last name
          <input type="text" id="lname" {...register("lname", { required: true, minLength: 2, maxLength: 40, pattern: /^[A-Za-z]+$/i })} />
        </label>
      </div>
      <div className="form-control">
        <label htmlFor="reason">
          Reason
          <select name="reason" id="reason" {...register("reason", { required: true })}>
            <option value="">Make a selection</option>
            <option value="1">First</option>
            <option value="2">Second</option>
            <option value="3">Third</option>
          </select>
        </label>
      </div>
      <div className="form-control">
        <label htmlFor="message">
          Message
          <textarea name="message" id="message" rows={5} {...register("message", { required: true, minLength: 2, maxLength: 4096 })} />
        </label>
      </div>
      <div className="form-control">
        <input type="submit" />
      </div>
    </form>
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: "200px", height: "20px", border: "2px solid black" }}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%`, height: "100%", backgroundColor: 'green' }}
        ></div>
      </div>
    </div>
  </>)
}
