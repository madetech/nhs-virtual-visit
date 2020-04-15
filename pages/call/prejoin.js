import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../src/components/Button';
import FormGroup from '../../src/components/FormGroup';
import { GridRow, GridColumn } from '../../src/components/Grid';
import Heading from '../../src/components/Heading';
import Hint from '../../src/components/Hint';
import Input from '../../src/components/Input';
import Label from '../../src/components/Label';
import Layout from '../../src/components/Layout';
import Lead from '../../src/components/Lead';

const PreJoin = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    router.push(`/call/${router.query.callId}?name=${name}`);
  });

  return (
    <Layout>
      <GridRow>
        <GridColumn width="full">
          <Heading>Joining video call</Heading>
          <Lead>You are about to be connected to a video call.</Lead>
          <GridRow>
              <GridColumn width="one-half">
              <form onSubmit={onSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Your name</Label>
                  <Hint>We'll show this to everyone in the call.</Hint>

                  <Input
                    type="text"
                    onChange={(event) => setName(event.target.value)}
                    name="name"
                  />
                  <Button className="nhsuk-u-margin-top-5">
                    Join video call
                  </Button>
                </FormGroup>
              </form>
            </GridColumn>
          </GridRow>
        </GridColumn>
        <span style={{ clear: 'both', display: 'block' }}></span>
      </GridRow>
    </Layout>
  )
}

export default PreJoin;
