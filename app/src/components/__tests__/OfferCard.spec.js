import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OfferCard from '../OfferCard.vue'

const offer = {
  id: 3,
  title: '+30 points Crèmerie',
  description: 'Dès un produit de crèmerie acheté.',
  bonusPoints: 30,
}

describe('OfferCard', () => {
  it("affiche le titre, les points et la description de l'offre", () => {
    const wrapper = mount(OfferCard, { props: { offer } })

    expect(wrapper.text()).toContain('+30 points Crèmerie')
    expect(wrapper.find('.badge').text()).toBe('+30')
    expect(wrapper.text()).toContain('Dès un produit de crèmerie acheté.')
  })

  it("émet activate avec l'id de l'offre au clic sur Activer", async () => {
    const wrapper = mount(OfferCard, { props: { offer } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('activate')).toEqual([[3]])
  })

  it("remplace le bouton par un statut quand l'offre est activée", () => {
    const wrapper = mount(OfferCard, { props: { offer, activated: true } })

    expect(wrapper.text()).toContain('Offre activée')
    expect(wrapper.text()).not.toContain('Activer')
  })

  it('accepte un contenu personnalisé dans ses slots', () => {
    const wrapper = mount(OfferCard, {
      props: { offer },
      slots: {
        default: '<p class="custom">Valable en magasin</p>',
        actions: '<span class="custom-action">Offre expirée</span>',
      },
    })

    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('.custom-action').text()).toBe('Offre expirée')
    expect(wrapper.text()).not.toContain('Dès un produit')
  })
})
