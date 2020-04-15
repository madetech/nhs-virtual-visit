import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';

const Call = () => {
  const { query: { id } } = useRouter();

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: "MadeTechJitsiPOC",
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#meet"),
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
      },
    };
    
    const api = new window.JitsiMeetExternalAPI(domain, options);
  }, []);
     
  return (
    <Layout>
      Call Id: {id}

      <main>
        <div id="meet"></div>
      </main>

      <style jsx global>{`
      #meet, #meet > iframe {
          min-height: 100vh;
        }
      `}</style>
    </Layout>
  );
};

export default Call;
