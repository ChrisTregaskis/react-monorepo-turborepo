import React from "react";

export const Button = ({ children }: { children: React.ReactNode }) => (
  <button style={{ padding: 8, borderRadius: 4 }}>{children}</button>
);
