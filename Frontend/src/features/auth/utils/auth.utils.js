export const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { level: 0, label: "", cls: "" };
    if (pwd.length < 4) return { level: 1, label: "Weak", cls: "weak" };
    if (pwd.length < 7) return { level: 2, label: "Fair", cls: "fair" };
    if (pwd.length < 10) return { level: 3, label: "Good", cls: "good" };
    return { level: 4, label: "Strong", cls: "strong" };
  };
