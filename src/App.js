import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import { useContract, useContractWrite, useAddress, useClaimedNFTSupply, useUnclaimedNFTSupply, useActiveClaimConditionForWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import preview from "./images/preview.gif"
import "./styles/Home.css";

const nftDropContractAddress ="0xC16D0e7bee544Cae693D3C91C91A2d7D93EeDa78";

export default function Home() {

  const {contract: nftDrop} = useContract(nftDropContractAddress);
  const address = useAddress();

  const [quantity, setQuantity] = useState(1);

  const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
  const claimedSupply = useClaimedNFTSupply(nftDrop);

  const activeClaimCondition = useActiveClaimConditionForWallet(nftDrop, address);



  return (
    <div className="container">
      <main className="mintInfoContainer">

        <div className="imageSide">
          <img 
          className="iamge"
          src={preview}
          alt="Emoji Faces preview"
          />
        </div>

        <div className="mintCompletionArea">

          <div className="mintAreaLeft">
            Total Minted
          </div>

          <div className="mintAreaRight">
            <p>
              <b>{ Number(claimedSupply.data) }/50</b>
            </p>
          </div>

          <div>
            <h2>Quantity</h2>
            <div className="quantityContainer">

              <button 
              className="quantityControlButton"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              >-</button>

              <h4>{quantity}</h4>

              <button 
              className="quantityControlButton"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= Number(activeClaimCondition.data?.maxClaimablePerWallet)}
              >+</button>

            </div>
          </div>

        </div>

        <div className="mintContainer">

          { Number(unclaimedSupply?.data) + Number(claimedSupply?.data) == Number(claimedSupply?.data) ? 
          
          <div> 
            Sold Out
          </div> :
          
          <Web3Button
          contractAddress={nftDropContractAddress}
          action={(contract) => contract.erc721.claim(quantity)}
          onError={(err) => {
            alert("Error", err.message);
          }}
          onSuccess={() => {
            alert("Success");
          }}
          >
            Mint  ({Number(activeClaimCondition.data?.currencyMetadata.displayValue) * quantity} {activeClaimCondition.data?.currencyMetadata.symbol} )

          </Web3Button>

          }

        </div>

      </main>
    </div>
  );
}
