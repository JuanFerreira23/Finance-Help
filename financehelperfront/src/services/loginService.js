export const login = async (email, password) => {
  try {
    const response = await fetch("https://localhost:7219/api/Usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();
    return data; // Retorna apenas os dados, sem manipulação extra
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export function saveTokens({ accessToken, refreshToken, idUsuario }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  if (idUsuario) {
    localStorage.setItem("idUsuario", idUsuario);
  }
}


export const getAccessToken = () => localStorage.getItem("accessToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");