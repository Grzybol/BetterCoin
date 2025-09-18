# Wdrożenie BetterCoin na Ethereum Mainnet

Poniższa instrukcja opisuje kompletny proces wdrożenia kontraktu `BetterCoin.sol` na główną sieć Ethereum (mainnet) przy użyciu Hardhata. Zawiera wskazówki dotyczące konfiguracji środowiska, bezpieczeństwa kluczy oraz weryfikacji wdrożenia.

## 1. Wymagania wstępne

- Node.js w wersji 18+ oraz npm.
- Zainstalowane zależności projektu (`npm install`).
- Skopiowany plik `.env` na podstawie `.env.example`.
- Konto Ethereum z odpowiednimi środkami na opłacenie gazu (zalecane użycie portfela sprzętowego lub multisig).
- Klucz API Etherscan z uprawnieniami do mainnetu (potrzebny do weryfikacji kontraktu).

## 2. Konfiguracja zmiennych środowiskowych

Uzupełnij plik `.env` o następujące wartości:

```ini
MAINNET_RPC_URL="https://mainnet.infura.io/v3/<TWOJE_API_KEY>"
PRIVATE_KEY="0x..."                 # Prywatny klucz konta wdrożeniowego
ETHERSCAN_MAINNET_API_KEY="..."      # Klucz API Etherscan dla sieci mainnet
```

> ⚠️ **Bezpieczeństwo klucza prywatnego:** Nigdy nie commituj ani nie udostępniaj prywatnego klucza. Rozważ użycie narzędzi takich jak HashiCorp Vault, AWS Secrets Manager lub zmiennych środowiskowych CI/CD do bezpiecznego dostarczania kluczy w procesie automatycznym.

## 3. Rozszerzenie konfiguracji Hardhat

Dodaj konfigurację sieci mainnet w pliku `hardhat.config.js`. Przykład sekcji `networks` oraz `etherscan` po aktualizacji:

```js
const { SEPOLIA_RPC_URL, MAINNET_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, ETHERSCAN_MAINNET_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: { url: "http://127.0.0.1:8545" },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    mainnet: {
      url: MAINNET_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY || "",
      mainnet: ETHERSCAN_MAINNET_API_KEY || "",
    },
  },
};
```

> Jeżeli chcesz uniknąć modyfikowania pliku konfiguracyjnego lokalnie, możesz wstrzyknąć parametry sieci mainnet dynamicznie, np. poprzez plugin `hardhat-deploy` lub skrypt CLI. Powyższy przykład jest jednak najprostszym wariantem.

## 4. Kompilacja i testy przed wdrożeniem

```bash
npx hardhat compile
npx hardhat test
```

Upewnij się, że wszystkie testy przechodzą, a generowany bytecode odpowiada wersji, którą chcesz wdrożyć.

## 5. Wykonanie wdrożenia na mainnet

1. Zweryfikuj saldo konta wdrożeniowego (np. przez `etherscan.io/address/<address>`).
2. Uruchom skrypt wdrożeniowy z parametrem `--network mainnet`:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```
3. Zanotuj adres wdrożonego kontraktu wypisany w konsoli. Zapisz go w bezpiecznym miejscu (np. w menedżerze haseł lub repozytorium infrastruktury).
4. (Opcjonalnie) Skonfiguruj alerty monitorujące kontrakt (Blocknative, Tenderly, OpenZeppelin Defender) w celu wykrywania nieautoryzowanych transferów lub anomalii.

## 6. Weryfikacja kontraktu na Etherscan

Po udanym wdrożeniu możesz zweryfikować kontrakt na Etherscan, aby ułatwić innym interakcję z nim:

```bash
npx hardhat run scripts/verify.js \
  --network mainnet \
  --address 0xAdresTwojegoKontraktu \
  --owner 0xAdresWlasciciela
```

Po kilku minutach status weryfikacji powinien zmienić się na „Contract Source Code Verified”.

## 7. Czynności po wdrożeniu

- Przetestuj podstawowe operacje (transfer, mint, burn) na niewielkich kwotach, korzystając z interfejsu Etherscan lub własnych skryptów.
- Zabezpiecz środki z konta wdrożeniowego – jeżeli klucz prywatny nie będzie już potrzebny, przenieś resztę ETH na bezpieczniejszy portfel.
- Udokumentuj adres kontraktu oraz procedury operacyjne dla zespołu.
- Rozważ wdrożenie automatycznych kopii zapasowych i monitoringu logów (np. `eth_getLogs` z usług Infury, Alchemy czy QuickNode).

## 8. Automatyzacja i CI/CD

Jeżeli planujesz wdrożenia z pipeline’u CI/CD:

1. Zapisz wartości `.env` jako sekrety w systemie CI (np. GitHub Actions Secrets).
2. Dodaj job wykonujący kroki: `npm ci`, `npx hardhat compile`, `npx hardhat run scripts/deploy.js --network mainnet`.
3. Zadbaj o mechanizmy potwierdzania wdrożenia (manual approval) przed wykonaniem kroku produkcyjnego.
4. Loguj wyniki wdrożeń do systemu obserwowalności (Slack, e-mail, narzędzia DevOps).

## 9. Lista kontrolna

- [ ] Zmienne środowiskowe (`MAINNET_RPC_URL`, `PRIVATE_KEY`, `ETHERSCAN_MAINNET_API_KEY`) ustawione poprawnie.
- [ ] Hardhat skompilował kontrakty bez błędów.
- [ ] Testy przeszły pomyślnie na lokalnym środowisku.
- [ ] Konto wdrożeniowe posiada środki na gaz i jest odpowiednio zabezpieczone.
- [ ] Zapisano adres wdrożonego kontraktu.
- [ ] Kontrakt został zweryfikowany na Etherscan.
- [ ] Skonfigurowano monitoring i procedury operacyjne.

Po wykonaniu powyższych kroków kontrakt BetterCoin powinien działać na mainnecie Ethereum i być gotowy do wykorzystania w ekosystemie produkcyjnym.
