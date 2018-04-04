// @flow
import React from 'react';
import CheckboxContext from './context';

type CheckboxGroupPropsT = {
    children: *,
    name?: string,
    onChange: (values: string[], e: SyntheticEvent<HTMLInputElement>) => *,
    // Disable react/no-unused-prop-types until this bug is fixed and merged:
    // https://github.com/yannickcr/eslint-plugin-react/issues/1751
    // eslint-disable-next-line react/no-unused-prop-types
    values?: string[],
};

type CheckboxGroupStateT = {
    values: string[],
};

export default class CheckboxGroup extends React.Component<
    CheckboxGroupPropsT,
    CheckboxGroupStateT,
> {
    static getDerivedStateFromProps(nextProps: CheckboxGroupPropsT) {
        if (!nextProps.values) {
            return [];
        }

        if (Array.isArray(nextProps.values)) {
            return {
                values: nextProps.values.map((value) => value.toString()),
            };
        }

        if (typeof nextProps.values === 'string') {
            return {
                values: [nextProps.values],
            };
        }
    }

    state = {
        values: [],
    };

    removeValue = (value: string, originalEvent: SyntheticEvent<HTMLInputElement>) => {
        this.setState(
            (state) => {
                const { values } = state;
                const index = values.indexOf(value);
                if (index !== -1) {
                    const nextValues = values.slice();
                    nextValues.splice(index, 1);
                    return {
                        values: nextValues,
                    };
                }
            },
            () => {
                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(this.state.values, originalEvent);
                }
            },
        );
    };

    addValue = (value: string, originalEvent: SyntheticEvent<HTMLInputElement>) => {
        this.setState(
            (state) => {
                const { values } = state;
                if (values.indexOf(value) === -1) {
                    return {
                        values: values.concat(value),
                    };
                }
            },
            () => {
                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(this.state.values, originalEvent);
                }
            },
        );
    };

    onChange = (e: SyntheticEvent<HTMLInputElement>) => {
        e.persist();
        const { currentTarget: { value, checked } } = e;

        if (checked) {
            this.addValue(value, e);
        } else {
            this.removeValue(value, e);
        }
    };

    render() {
        return (
            <CheckboxContext.Provider
                value={{
                    name: this.props.name,
                    values: this.state.values,
                    onChange: this.onChange,
                }}
            >
                {this.props.children}
            </CheckboxContext.Provider>
        );
    }
}
