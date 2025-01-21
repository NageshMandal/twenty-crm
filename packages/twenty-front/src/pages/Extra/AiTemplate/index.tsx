import React from "react";
import { useForm } from "react-hook-form";

import Button from "src/components/base/Button";
import Checkbox from "src/components/base/Checkbox";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import Textarea from "src/components/base/Textarea";

const AiEmailBuilder: React.FC = () => {
  const { control } = useForm();
  return (
    <div>
      <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
        AI Email Builder
      </h2>
      <div className='grid grid-cols-12'>
        <div className='col-span-9 py-16'>
          <h2 className='py-16 border-r text-neutral-800 dark:text-neutral-300 border-borderColor dark:border-borderColor-dark'>
            Edit Template
          </h2>
          <div className='grid grid-cols-2 gap-16 pt-16 pb-20 pr-20 border-t border-r border-borderColor dark:border-borderColor-dark'>
            <div>
              <p className='pb-4 text-neutral-800 dark:text-neutral-300'>Subject:</p>
              <div className='px-10 py-8 mb-16 border border-borderColor dark:border-borderColor-dark text-neutral-800 dark:text-neutral-300'>
                {`Unlock Equity, {{ first_name }}`}
              </div>
              <div className='px-10 py-8 whitespace-pre-line border text-14 border-borderColor dark:border-borderColor-dark text-neutral-800 dark:text-neutral-300 pb-30'>
                Hey first_name,
                <br />
                <br />
                Knowing your role as title, you understand how private equity in real estate has
                been tricky for company. Realprop has a solution!
                <br />
                <br />
                We're making these investments more accessible and affordable using blockchain
                technology. As a bonus,
                <br />
                <br />
                we're seeing up to 13.43% Cap Rate. Ready to democratize real estate equity at
                company, first_name?
                <br />
                Invest now!
                <br />
                <br />
                Best, sender_first_name
              </div>
              <div className='flex justify-end py-20'>
                <Button rounded>AI assistant</Button>
              </div>
            </div>
            <div>
              <p className='pb-4 text-neutral-800 dark:text-neutral-300 '>
                Generate Preview for Contact (optional)
              </p>
              <div className='px-10 py-8 mb-16 border border-borderColor dark:border-borderColor-dark text-neutral-800 dark:text-neutral-300'>
                Choose a contact
              </div>
              <div className='px-10 py-8 whitespace-pre-line border bg-gray-200/50 border-borderColor dark:border-borderColor-dark text-neutral-800 dark:text-neutral-300 pb-30 dark:bg-contentColor-dark text-14'>
                Hey first_name,
                <br />
                <br />
                Knowing your role as title, you understand how private equity in real estate has
                been tricky for company. Realprop has a solution!
                <br />
                <br />
                We're making these investments more accessible and affordable using blockchain
                technology. As a bonus,
                <br />
                <br />
                We're making these investments more accessible and affordable using blockchain
                technology. As a bonus,
                <br />
                <br />
                We're making these investments more accessible and affordable using blockchain
                technology. As a bonus,
                <br />
                <br />
                we're seeing up to 13.43% Cap Rate. Ready to democratize real estate equity at
                company, first_name?
                <br />
                Invest now!
                <br />
                <br />
                Best, sender_first_name
              </div>
            </div>
          </div>
          <div className='flex gap-20 pt-10 border-t border-r pb-90 border-borderColor dark:border-borderColor-dark'>
            <Checkbox control={control} name='A' label='Include Signature' />
            <Checkbox control={control} name='B' label='Save as a new template' />
          </div>
        </div>
        <div className='flex flex-col col-span-3 gap-20 px-16 pb-70'>
          <div className='flex items-center gap-16 px-16 py-6 border border-borderColor dark:border-borderColor-dark'>
            <Icon name='MessageColor' />
            <p className='text-neutral-800 dark:text-neutral-300'>Outreach(AI Assistant)</p>
          </div>
          <Input
            label='Company / product name'
            className='bg-transparent'
            placeholder='Suisseblocks'
          />
          <Textarea
            label='What we offer (optional)'
            className='bg-transparent min-h-100'
            placeholder='Affordable real estate investments, leveraging blockchain technology to make investments accessible to a wider audience'
          />
          <Textarea
            label='Pain point'
            className='bg-transparent min-h-100'
            placeholder='Private equity has not been open to buyers before'
          />
          <Textarea
            label='Value proposition'
            className='bg-transparent min-h-100'
            placeholder='Democratizing private equity in real estate with blockchain technology'
          />
          <Input label='Call-to-action' className='bg-transparent' placeholder='Invest Now' />
          <Textarea
            label='Context to include (optional)'
            className='bg-transparent min-h-100'
            placeholder='We do up to 13.43% Cap Rate'
          />
          <Button buttonClassName='flex justify-end'>Generate</Button>
        </div>
      </div>
    </div>
  );
};

export default AiEmailBuilder;
