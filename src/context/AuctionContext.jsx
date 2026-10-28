import { createContext, useContext, useState, useEffect } from "react";

const AuctionContext = createContext();

const DEFAULT_USER = { username: "admin", password: "admin123" };

export function AuctionProvider({ children }) {
  const load = (key, def) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => load("loggedIn", false));
  const [teams, setTeams] = useState(() => load("teams", []));
  const [players, setPlayers] = useState(() => load("players", []));
  const [currentIdx, setCurrentIdx] = useState(() => load("currentIdx", 0));
  const [auctionStarted, setAuctionStarted] = useState(() => load("auctionStarted", false));

  useEffect(() => { localStorage.setItem("loggedIn", JSON.stringify(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem("teams", JSON.stringify(teams)); }, [teams]);
  useEffect(() => { localStorage.setItem("players", JSON.stringify(players)); }, [players]);
  useEffect(() => { localStorage.setItem("currentIdx", JSON.stringify(currentIdx)); }, [currentIdx]);
  useEffect(() => { localStorage.setItem("auctionStarted", JSON.stringify(auctionStarted)); }, [auctionStarted]);

  const login = (u, p) => {
    if (u === DEFAULT_USER.username && p === DEFAULT_USER.password) {
      setIsLoggedIn(true); return true;
    }
    return false;
  };
  const logout = () => setIsLoggedIn(false);

  const addTeam = (team) => setTeams(t => [...t, { ...team, id: Date.now(), budget: Number(team.budget), spent: 0, squad: [] }]);
  const removeTeam = (id) => setTeams(t => t.filter(x => x.id !== id));

  const addPlayer = (player) => setPlayers(p => [...p, { ...player, id: Date.now(), status: "pending", soldTo: null, soldPrice: 0 }]);
  const removePlayer = (id) => setPlayers(p => p.filter(x => x.id !== id));

  const sellPlayer = (playerId, teamId, price) => {
    setPlayers(p => p.map(x => x.id === playerId ? { ...x, status: "sold", soldTo: teamId, soldPrice: price } : x));
    setTeams(t => t.map(x => {
      if (x.id !== teamId) return x;
      const player = players.find(p => p.id === playerId);
      return { ...x, spent: x.spent + price, budget: x.budget - price, squad: [...x.squad, playerId] };
    }));
    advancePlayer();
  };

  const markUnsold = (playerId) => {
    setPlayers(p => p.map(x => x.id === playerId ? { ...x, status: "unsold" } : x));
    advancePlayer();
  };

  const advancePlayer = () => {
    setCurrentIdx(i => i + 1);
  };

  const resetAuction = () => {
    setPlayers(p => p.map(x => ({ ...x, status: "pending", soldTo: null, soldPrice: 0 })));
    setTeams(t => t.map(x => ({ ...x, spent: 0, budget: x.budget + x.spent, squad: [] })));
    setCurrentIdx(0);
    setAuctionStarted(false);
  };

  const pendingPlayers = players.filter(p => p.status === "pending");
  const currentPlayer = pendingPlayers[0] || null;

  return (
    <AuctionContext.Provider value={{
      isLoggedIn, login, logout,
      teams, addTeam, removeTeam,
      players, addPlayer, removePlayer,
      currentPlayer, currentIdx,
      sellPlayer, markUnsold,
      auctionStarted, setAuctionStarted,
      resetAuction
    }}>
      {children}
    </AuctionContext.Provider>
  );
}
const sellPlayer = (playerId, teamId, price) => {
  const player = players.find(p => p.id === playerId);
  setPlayers(p => p.map(x => x.id === playerId
    ? { ...x, status: "sold", soldTo: teamId, soldPrice: price }
    : x
  ));
  setTeams(t => t.map(x => {
    if (x.id !== teamId) return x;
    return {
      ...x,
      spent: x.spent + price,
      budget: x.budget - price,
      squad: [...x.squad, playerId]
    };
  }));
};

export const useAuction = () => useContext(AuctionContext);