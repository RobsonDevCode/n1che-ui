import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputBoxProps } from './types';
import {
  SIZE, VARIANT_INPUT, VARIANT_LABEL, VARIANT_PLACEHOLDER,
  DISABLED_INPUT, DISABLED_LABEL, ISSUE_INPUT, ISSUE_LABEL,
  HELPER_BASE, HELPER_ISSUE, BASE_INPUT, BASE_LABEL, FIELD,
} from './constants';

export default function InputBox({
  label, variant = 'default', size = 'md', disabled = false,
  issue = false, helper, inputStyle, ...rest
}: InputBoxProps) {
  const [focused, setFocused] = useState(false);

  const s = SIZE[size];

  return (
    <View style={FIELD}>
      <Text style={[
        BASE_LABEL,
        { fontSize: s.labelSize },
        VARIANT_LABEL[variant],
        disabled && DISABLED_LABEL,
        issue && !focused && ISSUE_LABEL,
      ]}>
        {label}
      </Text>
      <TextInput
        style={[
          BASE_INPUT,
          {
            fontSize: s.fontSize,
            paddingVertical: s.paddingV,
            paddingHorizontal: s.paddingH,
          },
          VARIANT_INPUT[variant],
          disabled && DISABLED_INPUT,
          issue && !focused && ISSUE_INPUT,
          inputStyle,
        ]}
        placeholderTextColor={disabled ? '#C8C4BC' : VARIANT_PLACEHOLDER[variant]}
        editable={!disabled}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        {...rest}
      />
      {helper && (
        <Text style={[HELPER_BASE, issue && !focused && HELPER_ISSUE]}>
          {helper}
        </Text>
      )}
    </View>
  );
}
