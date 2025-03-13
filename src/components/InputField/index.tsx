import React from "react";
import { Input, InputProps, InputNumber, InputNumberProps } from "antd";
import "./styles.scss";

export type InputFieldType = "text" | "number" | "number-prefix" | "selectable";

export interface BaseInputFieldProps {
  label?: string;
  type?: InputFieldType;
  className?: string;
  error?: string;
}

export interface TextInputFieldProps
  extends BaseInputFieldProps,
    Omit<InputProps, "type"> {
  type?: "text";
}

export interface NumberInputFieldProps
  extends BaseInputFieldProps,
    Omit<InputNumberProps, "type" | "prefix"> {
  type: "number" | "number-prefix";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export interface SelectableInputFieldProps extends BaseInputFieldProps {
  type: "selectable";
  value?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClick?: () => void;
}

export type InputFieldProps =
  | TextInputFieldProps
  | NumberInputFieldProps
  | SelectableInputFieldProps;

export const InputField: React.FC<InputFieldProps> = (props) => {
  const { label, type = "text", className, error, ...restProps } = props;

  const renderInput = () => {
    // Declare variables outside of case blocks to avoid ESLint errors
    const textProps = restProps as InputProps;
    const numberProps = restProps as InputNumberProps;
    const prefixNumberProps = restProps as NumberInputFieldProps;
    const selectableProps = restProps as SelectableInputFieldProps;

    switch (type) {
      case "text":
        return <Input {...textProps} className="input-field-control" />;

      case "number":
        return <InputNumber {...numberProps} className="input-field-control" />;

      case "number-prefix":
        return (
          <div className="input-field-prefix-container">
            <InputNumber
              {...prefixNumberProps}
              className="input-field-control with-prefix"
            />
          </div>
        );

      case "selectable":
        return (
          <div
            className="input-field-selectable-container"
            onClick={selectableProps.onClick}
            tabIndex={0}
          >
            <Input {...textProps} className="input-field-control" readOnly/>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`input-field-wrapper ${className || ""} ${
        error ? "has-error" : ""
      }`}
    >
      {label && <label className="input-field-label">{label}</label>}
      {renderInput()}
      {error && <div className="input-field-error">{error}</div>}
    </div>
  );
};
